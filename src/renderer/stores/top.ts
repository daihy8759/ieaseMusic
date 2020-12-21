import { getTopList } from 'api/top';
import { selector } from 'recoil';

export const fetchListState = selector({
    key: 'fetchTopList',
    get: async () => {
        const list = await getTopList();
        return list;
    }
});
