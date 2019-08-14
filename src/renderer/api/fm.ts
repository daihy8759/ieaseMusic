import personalFm from './common/personal_fm';
import IArtist from 'interface/IArtist';
import ISong from 'interface/ISong';

interface PlaylistResponse {
    id: string | number;
    name: string;
    link: string;
    size: number;
    songs: ISong[];
}

async function getPlaylist(): Promise<PlaylistResponse> {
    let songs = [];
    try {
        const res = await personalFm();
        if (res.data.code !== 200) {
            throw res.data;
        }
        const { data } = res.data;
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
                    link: `/player/1/${album.id}`
                },
                artists: artists.map((ar: IArtist) => ({
                    id: ar.id,
                    name: ar.name,
                    link: ar.id ? `/artist/${ar.id}` : ''
                }))
            };
        })
    };
}

export { getPlaylist };
