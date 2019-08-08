import { loginWithPhone, loginRefresh } from 'api/login';
import { action, observable } from 'mobx';
import helper from 'utils/helper';
import storage from 'utils/storage';
import home from './home';

class Me {
    @observable initialized = false;

    @observable logining = false;

    @observable profile = {};

    @observable qrcode = {};

    @observable likes = new Map();

    @action
    init = async () => {
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
        this.profile = profile;
        this.initialized = true;
    };

    // @action
    // generate = async (type) {
    //     canceledGenerate && canceledGenerate();
    //     canceledWaiting && canceledWaiting();

    //     var response = await axios.get(
    //         `/api/qrcode/generate/${type}`,
    //         {
    //             cancelToken: new CancelToken(c => {
    //                 canceledGenerate = c;
    //             })
    //         }
    //     );

    //     if (response.data.success === false) {
    //         window.alert('Failed to login with QRCode, Please check your console(Press ⌘+⌥+I) and report it.');
    //         return;
    //     }

    //     this.qrcode = response.data;
    // }

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

        this.profile = data.profile;
        await home.load();
        await storage.set('profile', this.profile);
        this.logining = false;

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
