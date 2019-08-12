import { loginWithPhone, loginRefresh } from 'api/login';
import { dialog } from 'electron';
import { action, observable, runInAction } from 'mobx';
import helper from 'utils/helper';
import storage from 'utils/storage';
import QRCodeApi from 'api/qrcode';
import home from './home';

const { generate, polling } = QRCodeApi;

class Me {
    @observable initialized = false;

    @observable logining = false;

    @observable profile = {};

    @observable qrcode = {};

    @observable likes = new Map();

    @action
    async init() {
        let profile = await storage.get('profile');

        if (!profile) {
            profile = {};
        } else {
            const data = await loginRefresh();
            if (data.code === 301) {
                profile = {};
                await storage.remove('profile');
            }
        }
        runInAction(() => {
            this.profile = profile;
            this.initialized = true;
        });
    }

    @action
    generate = async type => {
        const data = await generate(type);

        if (data.success === false) {
            window.alert('Failed to login with QRCode, Please check your console(Press ⌘+⌥+I) and report it.');
            return;
        }

        this.qrcode = {
            ...data,
            type
        };
    };

    waiting = async done => {
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
    login = async (phone, password) => {
        this.logining = true;

        const formatter = helper.formatPhone(phone);
        const data = await loginWithPhone({
            countrycode: formatter.code,
            phone: formatter.phone,
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
    rocking = likes => {
        const mapping = new Map();
        mapping.set('id', likes.id);
        likes.songs.forEach(e => {
            mapping.set(e.id, true);
        });

        this.likes.replace(mapping);
    };

    isLiked = id => {
        return this.hasLogin() && this.likes.get(id);
    };

    hasLogin = () => {
        return !!this.profile.userId;
    };
}

const self = new Me();
export default self;
