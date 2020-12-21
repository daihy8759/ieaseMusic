import { getPlaylist } from 'api/fm';
import { selector } from 'recoil';

export const fetchFmListState = selector({
    key: 'fetchFmList',
    get: async () => {
        return await getPlaylist();
    }
});
