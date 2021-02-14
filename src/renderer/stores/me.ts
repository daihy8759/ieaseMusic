import _debug from 'debug';
import { makeAutoObservable, runInAction } from 'mobx';
import { useDialog, useMusicApi, useStorage } from '../hooks';
import home from './home';
import player from './player';
import QRCodeApi, { LoginType } from '/@/api/qrcode';
import ISong from '/@/interface/ISong';
import IUserProfile from '/@/interface/IUserProfile';
import helper from '/@/utils/helper';
import lastfm from '/@/utils/lastfm';

const { generate, polling } = QRCodeApi;
const dialog = useDialog();
const musicApi = useMusicApi();
const storage = useStorage();
const error = _debug('dev:me:error');

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
        let profile: IUserProfile = await storage.get('profile');
        if (!profile) {
            profile = {};
        } else {
            try {
                await musicApi.login_refresh({
                    cookie: profile.cookie,
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
            type,
        };
    };

    waiting = async (done: any) => {
        const { ticket, state, type } = this.qrcode;
        const data = await polling({
            ticket,
            state,
            type,
        });
        if (data.success === false) {
            dialog.showErrorBox(
                '错误',
                'Failed to login with QRCode, Please check your console(Press ⌘+⌥+I) and report it.'
            );
            return;
        }

        const { body } = await musicApi.login_status({});
        // @ts-ignore
        this.profile = body.profile;
        await storage.set('profile', {
            ...this.profile,
            cookie: body.cookie,
        });
        await this.init();
        await home.load();
        done();
        this.logining = false;
    };

    login = async (phone: string, password: string) => {
        this.logining = true;

        const formatter = helper.formatPhone(phone);
        try {
            const { body } = await musicApi.login_cellphone({
                countrycode: formatter.code.toString(),
                phone: formatter.phone.toString(),
                password,
            });
            if (body.code !== 200) {
                console.error(`Failed to login: ${body.msg}`);
                this.logining = false;
                return false;
            }

            runInAction(() => {
                const accountProfile = body.profile || {};
                const cookie = body.cookie as string[];
                this.profile = {
                    ...accountProfile,
                    cookie: cookie.join(''),
                };
            });
            // await storage.set('profile', this.profile);
            return this.profile;
        } catch (e) {
            error('me: Login Fail %s', e);
        } finally {
            runInAction(() => {
                this.logining = false;
            });
        }
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
        const cookie = this.profile.cookie;
        const { body } = await musicApi.like({ id: song.id, like, cookie });

        if (this.likes.get('id') === player.meta.id) {
            let { songs } = player;
            const index = songs.findIndex((e) => e.id === song.id);

            if (index === -1) {
                songs = [song, ...songs];
            } else {
                songs = [...songs.slice(0, index), ...songs.slice(index + 1, songs.length)];
            }

            player.songs = songs;
        }

        return body.code === 200;
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
