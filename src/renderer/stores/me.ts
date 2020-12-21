import helper from '@/utils/helper';
import QRCodeApi from 'api/qrcode';
import IUserProfile from 'interface/IUserProfile';
import { atom, selector } from 'recoil';
import storage from '../../shared/storage';
import Api from '../api';

const { generate, polling } = QRCodeApi;

// export const qrcodeState =

export const profileState = atom({
    key: 'profile',
    default: selector({
        key: 'profile/default',
        get: async () => {
            let profile: IUserProfile = storage.get('profile');

            if (!profile) {
                profile = {};
            } else {
                try {
                    await Api.login_refresh({
                        cookie: profile.cookie,
                    });
                } catch (e) {
                    profile = {};
                    storage.delete('profile');
                }
            }
            return profile;
        },
    }),
});

// 歌曲喜欢与取消喜欢
export const toggleLikeState = selector({
    key: 'toggleLike',
    get: () => {
        return { id: 0, like: true };
    },
    set: async ({ get }, params: { id: number; like: boolean }) => {
        const profile = get(profileState);
        await Api.like({ id: params.id, like: params.like, cookie: profile.cookie });
    },
});

export const loginState = selector({
    key: 'login',
    get: ({ get }) => {
        const profile = get(profileState);
        return !!profile.userId;
    },
});

export function logout() {
    storage.delete('profile');
}

export function isLiked(id: number) {
    const likes = storage.get('likes') as number[];
    return likes.includes(id);
}

export async function login(phone: string, password: string) {
    const formatter = helper.formatPhone(phone);
    const { body } = await Api.login_cellphone({
        countrycode: formatter.code.toString(),
        phone: formatter.phone.toString(),
        password,
    });
    if (body.code !== 200) {
        console.error(`Failed to login: ${body.msg}`);
        return false;
    }
    const accountProfile: {} = body.profile || {};
    const profile = {
        ...accountProfile,
        cookie: body.cookie,
    };
    storage.set('profile', profile);
    return profile;
}
