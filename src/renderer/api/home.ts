import { v4 as uuidv4 } from 'uuid';
import { useMusicApi } from '../hooks';

const musicApi = useMusicApi();

async function getSongs(id: number, cookie?: string) {
    try {
        const res = await musicApi.playlist_detail({ id, cookie });
        const { body } = res;
        if (body.code !== 200) {
            throw body;
        }
        // @ts-ignore
        return body.playlist.tracks.map((d: any) => {
            const { al, ar } = d;
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
    } catch (e) {
        console.error(e);
    }
    return {};
}

async function getPersonalized(cookie?: string) {
    try {
        const { body } = await musicApi.personalized({
            cookie,
        });
        if (body.code !== 200) {
            throw body;
        }
        // @ts-ignore
        return body.result.map((d: any) => {
            return {
                id: d.id,
                type: 0,
                name: d.name,
                played: d.playCount,
                cover: `${d.picUrl}?param=130y130`,
                background: `${d.picUrl}?param=500y500`,
                link: `/player/0/${d.id}`,
            };
        });
    } catch (e) {
        console.error(e);
    }
    return [];
}

async function getDaily(cookie?: string) {
    let list = [];
    const { body } = await musicApi.recommend_songs({ cookie });
    if (body.code !== 200) {
        throw body;
    }
    // @ts-ignore
    const dailySongs: any = body.data.dailySongs;
    list = [
        {
            id: uuidv4(),
            name: '♥️ 每日推荐歌曲',
            size: dailySongs.length,
            songs: dailySongs.map((d: any) => {
                const { al: album, ar: artists } = d;
                return {
                    id: d.id,
                    name: d.name,
                    duration: d.dt,
                    album: {
                        id: album.id,
                        name: album.name,
                        cover: `${album.picUrl}?param=100y100`,
                        link: `/player/1/${album.id}`,
                    },
                    artists: artists.map((e: any) => ({
                        id: e.id,
                        name: e.name,
                        // Broken link
                        link: e.id ? `/artist/${e.id}` : '',
                    })),
                };
            }),
        },
    ];
    return list;
}

async function getLiked(uid: number, cookie?: string) {
    try {
        const { body } = await musicApi.user_playlist({ uid, cookie });
        if (body.code !== 200) {
            console.error('Failed to get liked: {}', body);
        } else {
            // @ts-ignore
            const [liked] = body.playlist;
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
                    songs,
                },
            ];
        }
    } catch (ex) {
        console.error('Failed to get liked: %O', ex);
    }
    return [];
}

async function getRecommend(cookie?: string) {
    try {
        const { body } = await musicApi.recommend_resource({ cookie });
        if (body.code !== 200) {
            throw body;
        } else {
            const recommend: any = body.recommend;
            return recommend.map((e: any) => {
                return {
                    id: e.id,
                    type: 0,
                    name: e.name,
                    played: e.playcount,
                    cover: `${e.picUrl}?param=130y130`,
                    background: e.creator.backgroundUrl,
                    link: `/player/0/${e.id}`,
                };
            });
        }
    } catch (ex) {
        console.error('Failed to get recommend: %O', ex);
    }
    return [];
}

async function getNewest(cookie?: string) {
    try {
        const { body } = await musicApi.album_newest({ cookie });
        if (body.code !== 200) {
            throw body;
        } else {
            const albums: any = body.albums;
            return albums.map((e: any) => {
                return {
                    id: e.id,
                    type: 1,
                    name: e.name,
                    size: e.size,
                    cover: `${e.picUrl}?param=130y130`,
                    background: `${e.artist.picUrl}?param=640y300`,
                    link: `/player/1/${e.id}`,
                };
            });
        }
    } catch (ex) {
        console.error('Failed to get hot album: %O', ex);
    }
    return [];
}

async function getHomeData(id?: number, cookie?: string) {
    if (id) {
        const [liked, daily, recommend, personalizedList, newest] = await Promise.all([
            getLiked(id, cookie),
            getDaily(cookie),
            getRecommend(cookie),
            getPersonalized(cookie),
            getNewest(cookie),
        ]);
        return [...liked, ...daily, ...recommend, ...personalizedList, ...newest];
    }
    const list = await getPersonalized(cookie);
    if (list.length > 0) {
        list[0].songs = await getSongs(list[0].id);
    }
    return list;
}

export default { getHomeData };
