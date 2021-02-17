import { useMusicApi } from '../hooks';
import IAlbum from '/@/interface/IAlbum';
import IArtist from '/@/interface/IArtist';

const musicApi = useMusicApi();

async function getDesc(id: number) {
    try {
        const { body } = await musicApi.artist_desc({ id });
        if (body.code !== 200) {
            throw body;
        }
        const { briefDesc, introduction } = body;
        return {
            briefDesc,
            introduction,
        };
    } catch (e) {
        console.error(e);
    }
    return {
        briefDesc: '',
        introduction: [],
    };
}

async function getAlbums(id: number) {
    try {
        const { body } = await musicApi.artist_album({ id });
        if (body.code !== 200) {
            throw body;
        }
        const { hotAlbums } = body;
        // @ts-ignore
        return hotAlbums.map((e: IAlbum) => ({
            id: e.id,
            name: e.name,
            cover: e.picUrl,
            link: `/player/1/${e.id}`,
            publishTime: e.publishTime,
        }));
    } catch (e) {
        console.error(e);
    }
    return [];
}

/**
 * 获取相似歌手
 * ⚠️该接口需要登录
 */
async function getSimilar(id: number, cookie: string) {
    try {
        const { body } = await musicApi.simi_artist({ id, cookie });
        if (body.code === 200) {
            const artists: any = body.artists;
            return artists.map((e: any) => {
                return {
                    id: e.id,
                    name: e.name,
                    avatar: `${e.picUrl}?param=50y50`,
                    publishTime: e.publishTime,
                    // Broken link
                    link: e.id ? `/artist/${e.id}` : '',
                };
            });
        }
    } catch (e) {
        console.error(e);
    }
    return [];
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
                artists: ar.map((d: IArtist) => ({
                    id: d.id,
                    name: d.name,
                    link: d.id ? `/artist/${d.id}` : '',
                })),
            };
        });
        const [desc, albums, similar] = await Promise.all([getDesc(id), getAlbums(id), getSimilar(id)]);
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
            desc,
            albums,
            similar,
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
