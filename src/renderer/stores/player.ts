import { atom, selectorFamily } from 'recoil';
import pinyin from 'tiny-pinyin';
import { getPlayListDetail, getRecommend } from '/@/api/player';
import ISong from '/@/interface/ISong';
import { profileState } from '/@/stores/me';

const namespace = 'player';

// 搜索中
export const playerSearchState = atom({
    key: `${namespace}:searching`,
    default: false,
});

export const playerKeywordState = atom({
    key: `${namespace}:keyword`,
    default: '',
});

export const fetchListDetailState = selectorFamily({
    key: `${namespace}:getListDetail`,
    get: ({ type, id }: any) => async ({ get }: any) => {
        const profile = get(profileState);
        const detail = await getPlayListDetail(type, id, profile.cookie);
        return {
            songs: (detail.songs || []) as ISong[],
            meta: detail.meta,
        };
    },
});

export const fetchRelatedState = selectorFamily({
    key: `${namespace}:getRelated`,
    get: ({ songId, artistId }: { songId?: number; artistId?: number }) => async ({ get }) => {
        if (!songId || !artistId) {
            return {
                recommend: [],
                users: [],
                artists: [],
            };
        }
        const profile = get(profileState);
        const data = await getRecommend(songId, artistId, profile.cookie);
        return {
            recommend: data.playlists as [],
            users: data.users as [],
            artists: data.artists as [],
        };
    },
});

type FilterParam = { keywords?: string; songs?: ISong[] };

export const filterSongsState = selectorFamily({
    key: `${namespace}:filterSongs`,
    // @ts-ignore https://github.com/facebookexperimental/Recoil/issues/629
    get: ({ keywords, songs }: FilterParam) => async () => {
        if (!keywords || !songs) {
            return songs || [];
        }
        const text = pinyin.convertToPinyin(keywords.trim());
        return songs.filter((e) => {
            return (
                pinyin.convertToPinyin(e.name).indexOf(text) > -1 ||
                pinyin.convertToPinyin(e.album?.name || '').indexOf(text) > -1 ||
                e.artists?.findIndex((d) => pinyin.convertToPinyin(d.name).indexOf(text) > -1) !== -1
            );
        });
    },
});
