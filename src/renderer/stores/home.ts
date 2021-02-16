import { atom, selector, useRecoilValue } from 'recoil';
import { useTogglePlayList } from './controller';
import { profileState } from './me';
import homeApi from '/@/api/home';
import { useStorage } from '/@/hooks';
import ISong from '/@/interface/ISong';
import helper from '/@/utils/helper';

export interface HomeData {
    id?: number;
    name: string;
    size: any;
    link: string;
    background: string;
    played: number;
    type: number;
    pallet: any;
    cover: string;
    songs: ISong[];
}

const namespace = 'home';
const initHome = 'initHome';
const storage = useStorage();

export const homeListDefault = selector({
    key: `${namespace}:list`,
    get: async ({ get }) => {
        localStorage.setItem(initHome, '0');
        console.log('get home list');
        const profile = get(profileState);
        let list: HomeData[];
        let hasFavorite = false;
        let hasRecommend = false;
        try {
            if (profile.userId && profile.cookie) {
                list = await homeApi.getHomeData(profile.userId, profile.cookie);
                const [favorite, recommend] = list;

                if (favorite.size > 0) {
                    const likes: number[] = [];
                    favorite.songs.forEach((song) => {
                        likes.push(song.id);
                    });
                    await storage.set('likes', likes);
                    hasFavorite = true;
                }
                if (recommend.size > 0) {
                    hasRecommend = true;
                }
            } else {
                list = await homeApi.getHomeData();
                if (list.length === 0) {
                    console.error('get home request failed');
                }
            }
            await Promise.all(
                list.map(async (e) => {
                    e.pallet = false;
                    if (!e.cover) return;
                    const pallet = await helper.getPallet(`${e.cover.replace(/\?param=.*/, '')}?param=20y20`);
                    e.pallet = pallet;
                })
            );
            return {
                list,
                hasFavorite,
                hasRecommend,
            };
        } catch (e) {
            console.error('load home list failed');
        }
    },
});

export const homeListState = atom({
    key: '${namespace}:list',
    default: homeListDefault,
});

const preparePlaylist = (homeData: any) => {
    if (homeData.hasFavorite) {
        return homeData.list[0];
    }
    if (homeData.hasRecommend) {
        return homeData.list[1];
    }
    return homeData[2];
};

export function useSetupHome() {
    const homeData = useRecoilValue(homeListState);
    const setPlaylist = useTogglePlayList();

    const setupHome = () => {
        if (localStorage.getItem(initHome) === '0') {
            setPlaylist({ playList: preparePlaylist(homeData) });
            localStorage.setItem(initHome, '1');
        }
    };

    return setupHome;
}
