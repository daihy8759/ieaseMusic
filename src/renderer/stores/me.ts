import { loginRefresh, loginWithPhone } from 'api/login';
import QRCodeApi, { LoginType } from 'api/qrcode';
import { likeSong, unlikeSong } from 'api/user';
import { dialog } from 'electron';
import ISong from 'interface/ISong';
import { action, observable, runInAction } from 'mobx';
import helper from 'utils/helper';
import lastfm from 'utils/lastfm';
import storage from '../../shared/storage';
import home from './home';
import player from './player';
import IUserProfile from 'interface/IUserProfile';

const { generate, polling } = QRCodeApi;

class Me {
    @observable initialized = false;

    @observable logining = false;

    @observable profile: IUserProfile = {};

    @observable qrcode: any = {};

    @observable likes = new Map();

    @action
    async init() {
        let profile = storage.get('profile');

        if (!profile) {
            profile = {};
        } else {
            const data = await loginRefresh();
            if (data.code === 301) {
                profile = {};
                // @ts-ignore
                await storage.remove('profile');
            }
        }
        runInAction(() => {
            this.profile = profile;
            this.initialized = true;
        });
    }

    @action
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

    waiting = async () => {
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

        // this.profile = await getProfile();
        // await storage.set('profile', this.profile);
        // await this.init();
        // await home.load();
        // done();
        this.logining = false;
    };

    @action
    login = async (phone: string, password: string) => {
        this.logining = true;

        const formatter = helper.formatPhone(phone);
        const data = await loginWithPhone({
            countrycode: formatter.code.toString(),
            phone: formatter.phone.toString(),
            password
        });

        if (data.code !== 200) {
            console.error(`Failed to login: ${data.msg}`);
            this.logining = false;
            return false;
        }

        runInAction(() => {
            this.profile = data.profile;
        });
        await storage.set('profile', this.profile);
        runInAction(() => {
            this.logining = false;
        });
        return this.profile;
    };

    @action
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

    @action
    like = async (song: ISong) => {
        await lastfm.love(song);
        const result = await this.exeLike(song, true);
        runInAction(() => {
            if (result) {
                this.likes.set(song.id, true);
            }
        });
    };

    @action
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
