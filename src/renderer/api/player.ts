import albumList from './common/album';
import playListDetail from './common/playlist_detail';
import simiArtist from './common/simi_artist';
import simiPlaylist from './common/simi_playlist';
import simiSong from './common/simi_song';
import simiUser from './common/simi_user';

async function getSongUrl(query: any) {
    const { id } = query;
    return {
        id,
        src: `https://music.163.com/song/media/outer/url?id=${id}.mp3`
    };
}

// 相似歌手
async function getRecentUser(id: number) {
    try {
        const res = await simiUser({ id });
        if (res.data.code === 200) {
            return res.data.userprofiles.map((e: any) => {
                return {
                    id: e.userId,
                    name: e.nickname,
                    avatar: `${e.avatarUrl}?param=50y50`,
                    link: `/user/${e.userId}`
                };
            });
        }
    } catch (e) {
        console.error(e);
    }
    return [];
}

async function getSimilarArtist(id: number) {
    try {
        const res = await simiArtist({ id });
        if (res.data.code === 200) {
            return res.data.artists.map((e: any) => {
                return {
                    id: e.id,
                    name: e.name,
                    avatar: `${e.picUrl}?param=50y50`,
                    // Broken link
                    link: e.id ? `/artist/${e.id}` : ''
                };
            });
        }
    } catch (e) {
        console.error(e);
    }
    return [];
}

async function getSimilarPlaylist(id: number) {
    try {
        const res = await simiPlaylist({ id });
        if (res.data.code === 200) {
            return res.data.playlists.map((e: any) => {
                return {
                    id: e.id,
                    name: e.name,
                    cover: e.coverImgUrl,
                    link: `/player/0/${e.id}`
                };
            });
        }
    } catch (e) {
        console.error(e);
    }
    return [];
}

async function getAlbumBySong(id: number) {
    try {
        const res = await simiSong({ id });
        if (res.data.code === 200) {
            return res.data.songs.map((e: any) => {
                const { album } = e;

                return {
                    id: album.id,
                    name: album.name,
                    cover: album.picUrl,
                    link: `/player/1/${album.id}`
                };
            });
        }
    } catch (e) {
        console.error(e);
    }
    return [];
}

async function getRecommend(songid: number, artistid: number) {
    const [users, artists, playlists1, playlists2] = await Promise.all([
        getRecentUser(songid),
        getSimilarArtist(artistid),
        getAlbumBySong(songid),
        getSimilarPlaylist(songid)
    ]);
    return {
        users,
        artists,
        playlists: [...playlists1, ...playlists2]
    };
}

async function getPlayListDetail(type: string, id: number) {
    const resData: any = {};
    let songs = [];
    if (type === '0') {
        const res = await playListDetail({ id });
        songs = res.data.playlist.tracks;
        const meta = res.data.playlist;
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
                    link: `/user/${meta.creator.userId}`
                }
            ],
            played: meta.playCount,
            subscribed: meta.subscribed
        };
    } else {
        const res = await albumList({ id });
        songs = res.data.songs;
        const meta = res.data.album;
        resData.meta = {
            name: meta.name,
            size: meta.size,
            cover: meta.picUrl,
            author: meta.artists.map((e: any) => ({
                id: e.id,
                name: e.name,
                link: e.id ? `/artist/${e.id}` : ''
            })),
            company: meta.company,
            subscribed: meta.info.liked
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
                link: `/player/1/${al.id}`
            },
            artists: ar.map((e: any) => ({
                id: e.id,
                name: e.name,
                link: e.id ? `/artist/${e.id}` : ''
            }))
        };
    });
    return resData;
}

export { getSongUrl, getPlayListDetail, getRecommend };
