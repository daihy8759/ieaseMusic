import { useMusicApi } from '../hooks';
import Artist from '/@/interface/Artist';

const musicApi = useMusicApi();

async function getSimilar(id: number) {
    const { body } = await musicApi.simi_artist({ id });
    if (body.code === 200) {
        const artists: any = body.artists;
        return artists.map((e: any) => {
            return {
                id: e.id,
                name: e.name,
                avatar: `${e.picUrl}?param=50y50`,
                publishTime: e.publishTime,
                link: e.id ? `/artist/${e.id}` : '#',
            };
        });
    }
}

async function getArtist(id: number) {
    try {
        const { body } = await musicApi.artists({ id: id.toString() });
        if (body.code !== 200) {
            throw body;
        }
        const { artist, hotSongs } = body;
        const songs = hotSongs.map((e: any) => {
            const { al, ar } = e;
            return {
                id: e.id,
                name: e.name,
                duration: e.dt,
                album: {
                    id: al.id,
                    name: al.name,
                    cover: `${al.picUrl}?param=640y300`,
                    link: `/player/1/${al.id}`,
                },
                artists: ar.map((d: Artist) => ({
                    id: d.id,
                    name: d.name,
                    link: d.id ? `/artist/${d.id}` : '',
                })),
            };
        });
        return {
            profile: {
                id: artist.id,
                uid: artist.accountId,
                name: artist.name,
                background: `${artist.picUrl}?param=640y300`,
                followed: artist.followed,
                size: {
                    song: artist.musicSize,
                    mv: artist.mvSize,
                    album: artist.albumSize,
                },
            },
            playlist: {
                id: artist.id,
                name: `TOP 50 - ${artist.name}`,
                size: 50,
                songs,
            },
        };
    } catch (e) {
        console.error(e);
    }
    return {
        profile: {},
        playlist: {},
    };
}

async function followUser(id: number) {
    try {
        const { body } = await musicApi.artist_sub({ id, t: 1 });
        if (body.code === 200) {
            return {
                success: false,
            };
        }
    } catch (e) {
        console.error(e);
    }
    return { success: false };
}

async function unFollowUser(id: number) {
    try {
        const { body } = await musicApi.artist_sub({ id, t: 0 });
        if (body.code === 200) {
            return {
                success: false,
            };
        }
    } catch (e) {
        console.error(e);
    }
    return { success: false };
}

export { getSimilar, getArtist, followUser, unFollowUser };
