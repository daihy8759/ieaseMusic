import { getTopList } from '/@/api/top';
import { selector } from 'recoil';

const namespace = 'top';

export const fetchListState = selector({
    key: `${namespace}:list`,
    get: async () => {
        const list = await getTopList();
        return list;
    },
});
