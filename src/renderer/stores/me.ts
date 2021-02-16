import { atom, atomFamily, selector, selectorFamily, useRecoilValue, useSetRecoilState } from 'recoil';
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
    key: `${namespace}:profile`,
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

export const likedState = atom({
    key: `${namespace}:liked`,
    default: false,
});

// ♥️ 歌曲
export function useToggleLike() {
    const song = useRecoilValue(songState);
    const profile = useRecoilValue(profileState);
    const setLiked = useSetRecoilState(likedState);

    const setAsync = async (likeParam?: ToggleLike) => {
        let songId = song.id;
        let liked = !isLiked(song.id);
        if (likeParam) {
            songId = likeParam.id;
            liked = likeParam.like;
        }
        const res = await musicApi.like({ id: songId, like: liked, cookie: profile.cookie });
        if (res.body.code === 200) {
            let likes = (await storage.get('likes')) || [];
            if (liked) {
                likes.push(songId);
            } else {
                likes = likes.filter((d: number) => d !== songId);
            }
            await storage.set('likes', likes);
            setLiked(liked);
        }
    };
    return setAsync;
}

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
            cookie: body.cookie.join(''),
        };
        storage.set('profile', profile);
        return profile;
    }
    return null;
}
