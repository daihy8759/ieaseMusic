import CRYPTO from 'utils/crypto';
import artistList from './common/artists';
import artistDesc from './common/artist_desc';
import artistAlbum from './common/artist_album';
import simiArtist from './common/simi_artist';

const { md5 } = CRYPTO;

async function getDesc(id) {
    try {
        const res = await artistDesc({ id });
        if (res.data.code !== 200) {
            throw res.data;
        }
        const { briefDesc, introduction } = res.data;
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

async function getAlbums(id) {
    try {
        const res = await artistAlbum({ id });
        if (res.data.code !== 200) {
            throw res.data;
        }
        const { hotAlbums } = res.data;
        return hotAlbums.map(e => ({
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
async function getSimilar(id) {
    try {
        const res = await simiArtist({ id });
        if (res.data.code !== 200) {
            throw res.data;
        }
        const { artists } = res.data;
        return artists.map(e => ({
            id: e.id,
            name: e.name,
            avatar: e.picUrl,
            publishTime: e.publishTime,
            link: e.id ? `/artist/${e.id}` : ''
        }));
    } catch (e) {
        console.error(e);
    }
    return [];
}

function id2url(id) {
    const key = '3go8&$8*3*3h0k(2)2';
    const keyCodes = Array.from(key).map((e, i) => key.charCodeAt(i));
    const fidCodes = Array.from(id).map((e, i) => id.charCodeAt(i));

    const hashCodes = [];

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

async function getArtist(id) {
    try {
        const res = await artistList({ id });
        if (res.data.code !== 200) {
            throw res.data;
        }
        const { artist, hotSongs } = res.data;
        const songs = hotSongs.map(e => {
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
                artists: ar.map(d => ({
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

export { getArtist };
