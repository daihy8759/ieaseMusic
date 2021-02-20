import { selectorFamily } from 'recoil';
import { useMusicApi } from '../hooks';
import IAlbum from '../interface/IAlbum';
import { getArtist, getSimilar } from '/@/api/artist';

const namespace = 'artist';
const musicApi = useMusicApi();

// desc
export const fetchArtistDescState = selectorFamily({
    key: `${namespace}:desc`,
    get: (id: number) => async () => {
        const { body } = await musicApi.artist_desc({ id });
        if (body.code !== 200) {
            return {
                briefDesc: '',
                introduction: [],
            };
        }
        const { briefDesc, introduction } = body;
        return {
            briefDesc,
            introduction,
        };
    },
});

// albums
export const fetchArtistAlbumsState = selectorFamily({
    key: `${namespace}:albums`,
    get: (id: number) => async () => {
        const { body } = await musicApi.artist_album({ id });
        if (body.code !== 200) {
            return {
                id: '',
                name: '',
                cover: '',
                link: '#',
                publishTime: '',
            };
        }
        const { hotAlbums } = body;
        return hotAlbums.map((e: IAlbum) => ({
            id: e.id,
            name: e.name,
            cover: e.picUrl,
            link: `/player/1/${e.id}`,
            publishTime: e.publishTime,
        }));
    },
});

// similar
export const fetchArtistSimilarState = selectorFamily({
    key: `${namespace}:albums`,
    get: (id: number) => async () => {
        return getSimilar(id);
    },
});

export const fetchArtistState = selectorFamily({
    key: `${namespace}:artist`,
    get: (id: number) => async () => {
        const data = await getArtist(id);
        return {
            profile: data.profile,
            playlist: data.playlist,
        };
    },
});
