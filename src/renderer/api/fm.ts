import { PLAYLIST_FM } from '../../shared/interface/playlist';
import { useMusicApi } from '../hooks';
import Artist from '/@/interface/Artist';
import ISong from '/@/interface/ISong';

const musicApi = useMusicApi();
interface PlaylistResponse {
    id: string | number;
    name: string;
    link: string;
    size: number;
    songs: ISong[];
}

async function getPlaylist(): Promise<PlaylistResponse> {
    let songs: any = [];
    try {
        const { body } = await musicApi.personal_fm({});
        if (body.code !== 200) {
            throw body;
        }
        const { data } = body;
        songs = data || [];
        if (songs.length === 0) {
            return getPlaylist();
        }
    } catch (e) {
        console.error(e);
    }
    return {
        id: PLAYLIST_FM,
        name: 'Made For You',
        link: '/fm',
        size: songs.length,
        songs: songs.map((e: ISong) => {
            const { album, artists } = e;

            return {
                id: e.id,
                name: e.name,
                duration: e.duration,
                album: {
                    id: album.id,
                    name: album.name,
                    cover: album.picUrl,
                    link: `/player/1/${album.id}`,
                },
                artists: artists.map((ar: Artist) => ({
                    id: ar.id,
                    name: ar.name,
                    link: ar.id ? `/artist/${ar.id}` : '',
                })),
            };
        }),
    };
}

async function fmTrash(id: number, cookie?: string) {
    try {
        const { body } = await musicApi.fm_trash({ id, cookie });
        return body;
    } catch (e) {
        console.error(e);
    }
}

export { getPlaylist, fmTrash };
