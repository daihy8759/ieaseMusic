import uuid from 'uuid/v4';
import userPlayList from './common/user_playlist';
import recommendResource from './common/recommend_resource';
import recommendSongs from './common/recommend_songs';
import personalized from './common/personalized';
import playListDetail from './common/playlist_detail';
import albumNewest from './common/album_newest';

async function getSongs(id) {
    try {
        const res = await playListDetail({ id });
        if (res.data.code !== 200) {
            throw res.data;
        }
        return res.data.playlist.tracks.map(d => {
            const { al, ar } = d;
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
                artists: ar.map(e => ({
                    id: e.id,
                    name: e.name,
                    link: e.id ? `/artist/${e.id}` : ''
                }))
            };
        });
    } catch (e) {
        console.error(e);
        return [];
    }
}

async function getPersonalized() {
    try {
        const res = await personalized({});
        if (res.data.code !== 200) {
            throw res.data;
        }
        return res.data.result.map(d => {
            return {
                id: d.id,
                type: 0,
                name: d.name,
                played: d.playCount,
                cover: `${d.picUrl}?param=130y130`,
                background: `${d.picUrl}?param=500y500`,
                link: `/player/0/${d.id}`
            };
        });
    } catch (e) {
        console.error(e);
        return [];
    }
}

async function getDaily() {
    let list = [];
    const res = await recommendSongs();
    if (res.data.code !== 200) {
        throw res.data;
    }
    const { recommend } = res.data;
    list = [
        {
            id: uuid(),
            name: '每日推荐歌曲',
            size: recommend.length,
            songs: recommend.map(d => {
                const { album, artists } = d;
                return {
                    id: d.id,
                    name: d.name,
                    duration: d.duration,
                    album: {
                        id: album.id,
                        name: album.name,
                        cover: `${album.picUrl}?param=100y100`,
                        link: `/player/1/${album.id}`
                    },
                    artists: artists.map(e => ({
                        id: e.id,
                        name: e.name,
                        // Broken link
                        link: e.id ? `/artist/${e.id}` : ''
                    }))
                };
            })
        }
    ];
    return list;
}

async function getLiked(uid) {
    try {
        const res = await userPlayList({ uid });
        if (res.data.code !== 200) {
            console.error('Failed to get liked: {}', res.data);
        } else {
            const [liked] = res.data.playlist;
            const songs = await getSongs(liked.id);
            return [
                {
                    id: liked.id,
                    name: liked.name,
                    size: liked.trackCount,
                    updateTime: liked.updateTime,
                    publishTime: liked.publishTime,
                    link: `/player/0/${liked.id}`,
                    cover: liked.coverImgUrl,
                    background: liked.creator.backgroundUrl,
                    songs
                }
            ];
        }
    } catch (ex) {
        console.error('Failed to get liked: %O', ex);
    }
    return [];
}

async function getRecommend() {
    try {
        const res = await recommendResource();
        if (res.data.code !== 200) {
            throw res.data;
        } else {
            return res.data.recommend.map(e => {
                return {
                    id: e.id,
                    type: 0,
                    name: e.name,
                    played: e.playcount,
                    cover: `${e.picUrl}?param=130y130`,
                    background: e.creator.backgroundUrl,
                    link: `/player/0/${e.id}`
                };
            });
        }
    } catch (ex) {
        console.error('Failed to get recommend: %O', ex);
    }
    return [];
}

async function getNewest() {
    try {
        const res = await albumNewest();
        if (res.data.code !== 200) {
            throw res.data;
        } else {
            return res.data.albums.map(e => {
                return {
                    id: e.id,
                    type: 1,
                    name: e.name,
                    size: e.size,
                    cover: `${e.picUrl}?param=130y130`,
                    background: `${e.artist.picUrl}?param=640y300`,
                    link: `/player/1/${e.id}`
                };
            });
        }
    } catch (ex) {
        console.error('Failed to get hot album: %O', ex);
    }
    return [];
}

async function getHomeData(id) {
    if (id) {
        const [liked, daily, recommend, personalizedList, newest] = await Promise.all([
            getLiked(id),
            getDaily(),
            getRecommend(),
            getPersonalized(),
            getNewest()
        ]);
        return [...liked, ...daily, ...recommend, ...personalizedList, ...newest];
    }
    const list = await getPersonalized();
    if (list.length > 0) {
        list[0].songs = await getSongs(list[0].id);
    }
    return list;
}

export default { getHomeData };
