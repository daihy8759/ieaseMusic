import { atom, selector } from 'recoil';
import { songState } from './controller';
import QRCodeApi from '/@/api/qrcode';
import { useMusicApi, useStorage } from '/@/hooks';
import IUserProfile from '/@/interface/IUserProfile';
import helper from '/@/utils/helper';

const { generate, polling } = QRCodeApi;
const storage = useStorage();
const musicApi = useMusicApi();

const namespace = 'me';

// export const qrcodeState =

export const profileState = atom({
    key: 'profile',
    default: selector({
        key: 'profile/default',
        get: async () => {
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
            return profile;
        },
    }),
});

interface ToggleLike {
    id: number;
    like: boolean;
}

export const likedState = selector({
    key: `${namespace}:liked`,
    get: ({ get }) => {
        const song = get(songState);
        return isLiked(song.id);
    },
});

// 歌曲喜欢与取消喜欢
export const toggleLikeState = selector({
    key: 'toggleLike',
    get: () => {
        return {} as ToggleLike | null;
    },
    set: async ({ get }, params) => {
        const song = get(songState);
        const profile = get(profileState);
        if (params) {
            const likeParam = params as ToggleLike;
            await musicApi.like({ id: likeParam.id, like: likeParam.like, cookie: profile.cookie });
            return;
        }
        if (song) {
            const liked = isLiked(song.id);
            await musicApi.like({ id: song.id, like: !liked, cookie: profile.cookie });
        }
    },
});

export const loginState = selector({
    key: `${namespace}:login`,
    get: ({ get }) => {
        const profile = get(profileState);
        return !!profile.userId;
    },
});

export function logout() {
    return storage.delete('profile');
}

export async function isLiked(id: number) {
    const likes = (await storage.get('likes')) || [];
    return likes.includes(id);
}

export async function login(phone: string, password: string) {
    const formatter = helper.formatPhone(phone);
    if (formatter && formatter.code && formatter.phone) {
        const { body } = await musicApi.login_cellphone({
            countrycode: formatter.code.toString(),
            phone: formatter.phone.toString(),
            password,
        });
        if (body.code !== 200) {
            console.error(`Failed to login: ${body.msg}`);
            return false;
        }
        const accountProfile = body.profile || {};
        const profile = {
            ...accountProfile,
            cookie: body.cookie,
        };
        storage.set('profile', profile);
        return profile;
    }
    return null;
}
