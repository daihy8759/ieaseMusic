import { atom, selector, selectorFamily } from 'recoil';
import searchByType from '../api/search';

const namespace = 'search';

export const loadingState = atom({
    key: `${namespace}:loading`,
    default: false,
});

export const keywordState = atom({
    key: `${namespace}:keyword`,
    default: '',
});

export const playlistQueryState = selector({
    key: `${namespace}:playlist`,
    get: async ({ get }) => {
        const keyword = get(keywordState);
        if (!keyword) {
            return [];
        }
        const data = await searchByType('1000', keyword);
        return data.playlists || [];
    },
});
