import { atom, selector, selectorFamily, useRecoilCallback } from 'recoil';
import { songState } from './controller';
import { useMusicApi, useStorage } from '/@/hooks';
import IUserProfile from '/@/interface/IUserProfile';
import helper from '/@/utils/helper';

export type LoginType = '10' | '2';

const storage = useStorage();
const musicApi = useMusicApi();

const namespace = 'me';

// 生成登录二维码地址
export const generateQrcode = selectorFamily({
    key: `${namespace}:generateQrcode`,
    get: (type: LoginType) => async () => {
        const data: any = await musicApi.login_qrcode_generate({ type });

        if (data.success === false) {
            window.alert('Failed to login with QRCode, Please check your console(Press ⌘+⌥+I) and report it.');
            return;
        }

        return {
            ...data,
            type,
        };
    },
});

export async function polling(type: LoginType, ticket: string) {
    const res = (await musicApi.login_qrcode_check({ type, ticket })) as any;
    let reqType = '';
    if (type === '10') {
        reqType = 'weichat';
        switch (res.errorCode) {
            case 405:
                return res.code;
            case 408:
            case 404:
                return polling(type, ticket);
            case 403:
                throw Error('Login by wechat, canceled');
            default:
                throw Error('An error occurred while login by wechat');
        }
    }

    if (type === '2') {
        reqType = 'weibo';
        switch (+res.status) {
            case 1:
            case 2:
                return polling(type, ticket);
            case 3: {
                // TODO parse
                // const q = url.parse(response.data.url, true);
                // return q.query.code;
            }
            default:
                throw Error('An error occurred while login by weibo');
        }
    }
    // 服务端实现
    // await axios.get(`http://music.163.com/back/${reqType}?code=${code}&state=${state}`);
}

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
    return useRecoilCallback(({ set, snapshot: { getPromise } }) => async (likeParam?: ToggleLike) => {
        const song = await getPromise(songState);
        const profile = await getPromise(profileState);

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
            set(likedState, liked);
        }
    });
}

export const loginState = selector({
    key: `${namespace}:login`,
    get: ({ get }) => {
        const profile = get(profileState);
        return !!profile.userId;
    },
});

// 退出登录
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
