import { useMusicApi } from '../hooks';
import { getSimilar } from './artist';

const musicApi = useMusicApi();

async function getSongUrl(id: number, cookie?: string) {
    const { body } = await musicApi.song_url({
        id,
        cookie,
    });
    return {
        id,
        // @ts-ignore
        src: body.data[0].url,
    };
}

// 相似歌手
async function getRecentUser(id: number, cookie?: string) {
    try {
        const { body } = await musicApi.simi_user({ id, cookie });
        if (body.code === 200) {
            const userProfiles: any = body.userprofiles;
            return userProfiles.map((e: any) => {
                return {
                    id: e.userId,
                    name: e.nickname,
                    avatar: `${e.avatarUrl}?param=50y50`,
                    link: `/user/${e.userId}`,
                };
            });
        }
    } catch (e) {
        console.error(e);
    }
    return [];
}

async function getSimilarPlaylist(id: number, cookie?: string) {
    try {
        const { body } = await musicApi.simi_playlist({ id, cookie });
        if (body.code === 200) {
            const playlists: any = body.playlists;
            return playlists.map((e: any) => {
                return {
                    id: e.id,
                    name: e.name,
                    cover: e.coverImgUrl,
                    link: `/player/0/${e.id}`,
                };
            });
        }
    } catch (e) {
        console.error(e);
    }
    return [];
}

async function getAlbumBySong(id: number, cookie?: string) {
    try {
        const { body } = await musicApi.simi_song({ id, cookie });
        if (body.code === 200) {
            const songs: any = body.songs;
            return songs.map((e: any) => {
                const { album } = e;

                return {
                    id: album.id,
                    name: album.name,
                    cover: album.picUrl,
                    link: `/player/1/${album.id}`,
                };
            });
        }
    } catch (e) {
        console.error(e);
    }
    return [];
}

async function getRecommend(songid: number, artistid: number, cookie?: string) {
    const [users, artists, playlists1, playlists2] = await Promise.all([
        getRecentUser(songid, cookie),
        getSimilar(artistid, cookie),
        getAlbumBySong(songid),
        getSimilarPlaylist(songid),
    ]);
    return {
        users,
        artists,
        playlists: [...playlists1, ...playlists2],
    };
}

async function getPlayListDetail(type: string, id: number, cookie?: string) {
    const resData: any = {};
    let songs: any = [];
    if (type === '0') {
        const { body } = await musicApi.playlist_detail({ id, cookie });
        const meta: any = body.playlist;
        songs = meta.tracks;
        resData.meta = {
            id,
            type,
            name: meta.name,
            size: meta.trackCount,
            cover: meta.coverImgUrl,
            author: [
                {
                    id: meta.creator.userId.toString(),
                    name: meta.creator.nickname,
                    link: `/user/${meta.creator.userId}`,
                },
            ],
            played: meta.playCount,
            subscribed: meta.subscribed,
        };
    } else {
        const { body } = await musicApi.album({ id, cookie });
        songs = body.songs;
        const meta: any = body.album;
        resData.meta = {
            name: meta.name,
            size: meta.size,
            cover: meta.picUrl,
            author: meta.artists.map((e: any) => ({
                id: e.id,
                name: e.name,
                link: e.id ? `/artist/${e.id}` : '',
            })),
            company: meta.company,
            subscribed: meta.info.liked,
        };
    }
    resData.songs = songs.map((d: any) => {
        const { al /* Album */, ar /* Artist */ } = d;
        return {
            id: d.id,
            name: d.name,
            duration: d.dt,
            album: {
                id: al.id,
                name: al.name,
                cover: `${al.picUrl}?param=y100y100`,
                link: `/player/1/${al.id}`,
            },
            artists: ar.map((e: any) => ({
                id: e.id,
                name: e.name,
                link: e.id ? `/artist/${e.id}` : '',
            })),
        };
    });
    return resData;
}

export { getSongUrl, getPlayListDetail, getRecommend };
