import { getPlaylist } from 'api/fm';
import { selector } from 'recoil';
import { playListState } from './controller';

export const fetchFmListState = selector({
    key: 'fetchFmList',
    get: async () => {
        return await getPlaylist();
    },
});

export const personFmState = selector({
    key: 'personFm',
    get: ({ get }) => {
        const controllerPlayList = get(playListState);
        return controllerPlayList.id === 'PERSONAL_FM';
    },
});
