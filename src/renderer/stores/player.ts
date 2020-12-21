import { profileState } from '@/stores/me';
import { getPlayListDetail, getRecommend } from 'api/player';
import ISong from 'interface/ISong';
import { selectorFamily } from 'recoil';
import * as pinyin from 'tiny-pinyin';

export const fetchListDetailState = selectorFamily({
    key: 'getListDetail',
    get: ({ type, id }: any) => async ({ get }: any) => {
        const profile = get(profileState);
        const detail = await getPlayListDetail(type, id, profile.cookie);
        return {
            songs: detail.songs || [],
            meta: detail.meta
        };
    }
});

export const fetchRelatedState = selectorFamily({
    key: 'getRelated',
    get: ({ songId, artistId }: { songId: number; artistId: number }) => async ({ get }) => {
        if (!songId || !artistId) {
            return {
                recommend: [],
                users: [],
                artists: []
            };
        }
        const profile = get(profileState);
        const data = await getRecommend(songId, artistId, profile.cookie);
        if (data) {
            return {
                recommend: data.playlists as [],
                users: data.users as [],
                artists: data.artists as []
            };
        }
    }
});

export const filterSongsState = selectorFamily({
    key: 'filterSongs',
    // @ts-ignore
    get: ({ keywords, songs }: { keywords: string; songs: ISong[] }) => () => {
        const text = pinyin.convertToPinyin(keywords.trim());
        return songs.filter(e => {
            return (
                pinyin.convertToPinyin(e.name).indexOf(text) > -1 ||
                pinyin.convertToPinyin(e.album.name).indexOf(text) > -1 ||
                e.artists.findIndex(d => pinyin.convertToPinyin(d.name).indexOf(text) > -1) !== -1
            );
        });
    }
});
