import { useMusicApi } from '../hooks';
import IArtist from '/@/interface/IArtist';
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
        id: 'PERSONAL_FM',
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
                artists: artists.map((ar: IArtist) => ({
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
