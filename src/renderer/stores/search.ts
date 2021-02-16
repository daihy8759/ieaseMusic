import { atom, selector } from 'recoil';
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

export const albumsQueryState = selector({
    key: `${namespace}:albums`,
    get: async ({ get }) => {
        const keyword = get(keywordState);
        if (!keyword) {
            return [];
        }
        const data = await searchByType('10', keyword);
        return data.albums || [];
    },
});

export const artistsQueryState = selector({
    key: `${namespace}:artists`,
    get: async ({ get }) => {
        const keyword = get(keywordState);
        if (!keyword) {
            return [];
        }
        const data = await searchByType('100', keyword);
        return data.artists || [];
    },
});

export const usersQueryState = selector({
    key: `${namespace}:users`,
    get: async ({ get }) => {
        const keyword = get(keywordState);
        if (!keyword) {
            return [];
        }
        const data = await searchByType('1002', keyword);
        return data.users || [];
    },
});
