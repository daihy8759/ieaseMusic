import { dialog } from 'electron';
import QRCodeApi, { LoginType } from 'api/qrcode';
import { likeSong, unlikeSong } from 'api/user';
import ISong from 'interface/ISong';
import IUserProfile from 'interface/IUserProfile';
import { makeAutoObservable, runInAction } from 'mobx';
import helper from 'utils/helper';
import lastfm from 'utils/lastfm';
import storage from '../../shared/storage';
import home from './home';
import player from './player';
import Api from '../api';

const { generate, polling } = QRCodeApi;

class Me {
    initialized = false;

    logining = false;

    profile: IUserProfile = {};

    qrcode: any = {};

    likes = new Map();

    constructor() {
        makeAutoObservable(this);
    }

    async init() {
        let profile: IUserProfile = storage.get('profile');

        if (!profile) {
            profile = {};
        } else {
            try {
                await Api.login_refresh({
                    cookie: profile.cookie
                });
            } catch (e) {
                profile = {};
                await storage.delete('profile');
            }
        }
        runInAction(() => {
            this.profile = profile;
            this.initialized = true;
        });
    }

    generate = async (type: LoginType) => {
        const data: any = await generate(type);

        if (data.success === false) {
            window.alert('Failed to login with QRCode, Please check your console(Press ⌘+⌥+I) and report it.');
            return;
        }

        this.qrcode = {
            ...data,
            type
        };
    };

    waiting = async (done: any) => {
        const { ticket, state, type } = this.qrcode;
        const data = await polling({
            ticket,
            state,
            type
        });
        if (data.success === false) {
            dialog.showErrorBox(
                '错误',
                'Failed to login with QRCode, Please check your console(Press ⌘+⌥+I) and report it.'
            );
            return;
        }

        const { body } = await Api.login_status({});
        // @ts-ignore
        this.profile = body.profile;
        await storage.set('profile', {
            ...this.profile,
            cookie: body.cookie
        });
        await this.init();
        await home.load();
        done();
        this.logining = false;
    };

    login = async (phone: string, password: string) => {
        this.logining = true;

        const formatter = helper.formatPhone(phone);
        const { body } = await Api.login_cellphone({
            countrycode: formatter.code.toString(),
            phone: formatter.phone.toString(),
            password
        });
        if (body.code !== 200) {
            console.error(`Failed to login: ${body.msg}`);
            this.logining = false;
            return false;
        }

        runInAction(() => {
            const accountProfile: {} = body.profile || {};
            this.profile = {
                ...accountProfile,
                cookie: body.cookie
            };
        });
        await storage.set('profile', this.profile);
        runInAction(() => {
            this.logining = false;
        });
        return this.profile;
    };

    rocking = (likes: any) => {
        const mapping = new Map();
        mapping.set('id', likes.id);
        likes.songs.forEach((e: any) => {
            mapping.set(e.id, true);
        });
        // @ts-ignore
        this.likes.replace(mapping);
    };

    isLiked = (id: number) => {
        return this.hasLogin() && this.likes.get(id);
    };

    hasLogin = () => {
        return !!this.profile.userId;
    };

    async exeLike(song: ISong, like: boolean) {
        let data;

        if (like) {
            data = await likeSong(song.id, like);
        } else {
            data = await unlikeSong(home.list[0].id, song.id);
        }

        if (this.likes.get('id') === player.meta.id) {
            let { songs } = player;
            const index = songs.findIndex(e => e.id === song.id);

            if (index === -1) {
                songs = [song, ...songs];
            } else {
                songs = [...songs.slice(0, index), ...songs.slice(index + 1, songs.length)];
            }

            player.songs = songs;
        }

        return data.code === 200;
    }

    async logout() {
        // @ts-ignore
        await storage.remove('profile');
    }

    like = async (song: ISong) => {
        await lastfm.love(song);
        const result = await this.exeLike(song, true);
        runInAction(() => {
            if (result) {
                this.likes.set(song.id, true);
            }
        });
    };

    unlike = async (song: ISong) => {
        await lastfm.unlove(song);
        const result = await this.exeLike(song, false);
        runInAction(() => {
            this.likes.set(song.id, !result);
        });
    };
}

const self = new Me();
export default self;
