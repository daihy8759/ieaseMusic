import ISong from '@/interface/ISong';
import homeApi from 'api/home';
import { selector } from 'recoil';
import helper from 'utils/helper';
import storage from '../../shared/storage';
import { profileState } from './me';
interface IHomeData {
    id?: number;
    size: any;
    pallet: any;
    cover: string;
    songs: ISong[];
}

export const homeListQuery = selector({
    key: 'homeList',
    get: async ({ get }) => {
        console.log('get home list');
        const profile = get(profileState);
        let list: IHomeData[];
        if (profile.userId && profile.cookie) {
            list = await homeApi.getHomeData(profile.userId, profile.cookie);
            const [favorite, recommend] = list;

            if (favorite.size > 0) {
                const likes: number[] = [];
                favorite.songs.forEach((song) => {
                    likes.push(song.id);
                });
                storage.set('likes', likes);
            }
        } else {
            list = await homeApi.getHomeData();
            if (list.length === 0) {
                console.error('get home request failed');
                return [];
            }
        }
        list.forEach((e) => {
            e.pallet = false;
            if (!e.cover) return;
            const pallet = helper.getPallet(`${e.cover.replace(/\?param=.*/, '')}?param=20y20`);
            e.pallet = pallet;
        });
        return list;
    },
});
