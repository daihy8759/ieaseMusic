// @ts-nocheck
import CRYPTO from 'utils/crypto';
import IArtist from 'interface/IArtist';
import IAlbum from 'interface/IAlbum';
import Api from './';

const { md5 } = CRYPTO;

async function getDesc(id: number) {
    try {
        const { body } = await Api.artist_desc({ id });
        if (body.code !== 200) {
            throw body;
        }
        const { briefDesc, introduction } = body;
        return {
            briefDesc,
            introduction
        };
    } catch (e) {
        console.error(e);
    }
    return {
        briefDesc: '',
        introduction: []
    };
}

async function getAlbums(id: number) {
    try {
        const { body } = await Api.artist_album({ id });
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
            publishTime: e.publishTime
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
async function getSimilar(id: number, cookie) {
    try {
        const { body } = await Api.simi_artist({ id, cookie });
        if (body.code === 200) {
            const artists: any = body.artists;
            return artists.map((e: any) => {
                return {
                    id: e.id,
                    name: e.name,
                    avatar: `${e.picUrl}?param=50y50`,
                    publishTime: e.publishTime,
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

function id2url(id: string) {
    const key = '3go8&$8*3*3h0k(2)2';
    const keyCodes = Array.from(key).map((_, i) => key.charCodeAt(i));
    const fidCodes = Array.from(id).map((_, i) => id.charCodeAt(i));

    const hashCodes: number[] = [];

    for (let i = 0; i < fidCodes.length; i++) {
        const code = (fidCodes[i] ^ keyCodes[i % key.length]) & 0xff;
        hashCodes.push(code);
    }

    const string = hashCodes.map((e, i) => String.fromCharCode(hashCodes[i])).join('');
    const md5String = md5(string);
    const result = Buffer.from(md5String)
        .toString('base64')
        .replace(/\//g, '_')
        .replace(/\+/g, '-');

    return `https://p4.music.126.net/${result}/${id}.jpg?param=y177y177`;
}

async function getArtist(id: number) {
    try {
        const { body } = await Api.artists({ id });
        if (body.code !== 200) {
            throw body;
        }
        const { artist, hotSongs } = body;
        // @ts-ignore
        const songs = hotSongs.map((e: any) => {
            const { al, ar } = e;
            return {
                id: e.id,
                name: e.name,
                duration: e.dt,
                album: {
                    id: al.id,
                    name: al.name,
                    cover: id2url(al.pic_str),
                    link: `/player/1/${al.id}`
                },
                artists: ar.map((d: IArtist) => ({
                    id: d.id,
                    name: d.name,
                    link: d.id ? `/artist/${d.id}` : ''
                }))
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
                    album: artist.albumSize
                }
            },
            desc,
            albums,
            similar,
            playlist: {
                id: artist.id,
                name: `TOP 50 - ${artist.name}`,
                size: 50,
                songs
            }
        };
    } catch (e) {
        console.error(e);
    }
    return {
        profile: {},
        playlist: {}
    };
}

async function followUser(id: number) {
    try {
        const { body } = await Api.artist_sub({ id, t: 1 });
        if (body.code === 200) {
            return {
                success: false
            };
        }
    } catch (e) {
        console.error(e);
    }
    return { success: false };
}

async function unFollowUser(id: number) {
    try {
        const { body } = await Api.artist_sub({ id, t: 0 });
        if (body.code === 200) {
            return {
                success: false
            };
        }
    } catch (e) {
        console.error(e);
    }
    return { success: false };
}

export { getSimilar, getArtist, followUser, unFollowUser };
