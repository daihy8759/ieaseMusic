import search from './common/search';
//  TODO: nextHref
async function getPlaylists(keywords: string, offset = 0) {
    let playlists = [];
    try {
        const res = await search({
            offset,
            keywords,
            limit: 30,
            type: 1000
        });
        if (res.data.code === 200) {
            playlists = res.data.result.playlists.map((e: any) => {
                const { creator } = e;
                return {
                    id: e.id,
                    name: e.name,
                    cover: e.coverImgUrl,
                    played: e.playCount,
                    star: e.bookCount,
                    size: e.trackCount,
                    link: `/player/0/${e.id}`,
                    creator: {
                        id: creator.id,
                        name: creator.name,
                        link: `/user/${creator.id}`
                    }
                };
            });
        }
    } catch (e) {
        console.error(e);
    }
    return {
        playlists,
        nextHref: playlists.length === 30 ? `/api/search/1000/${offset + 30}/${keywords}` : ''
    };
}

async function getAlbums(keywords: string, offset = 0) {
    try {
        const res = await search({
            offset,
            keywords,
            limit: 30,
            type: 10
        });
        if (res.data.code === 200) {
            return res.data.result.albums.map((e: any) => {
                const { artist } = e;
                return {
                    id: e.id,
                    name: e.name,
                    cover: e.picUrl,
                    publish: e.publishTime,
                    size: e.size,
                    link: `/player/1/${e.id}`,
                    artist: {
                        id: artist.id,
                        name: artist.name,
                        link: `/artist/${artist.id}`
                    }
                };
            });
        }
    } catch (e) {
        console.error(e);
    }
    return [];
}

async function getArtists(keywords: string, offset = 0) {
    try {
        const res = await search({
            offset,
            keywords,
            limit: 30,
            type: 100
        });
        if (res.data.code === 200) {
            return res.data.result.artists.map((e: any) => {
                return {
                    id: e.id,
                    name: e.name,
                    avatar:
                        e.picUrl ||
                        'http://p3.music.126.net/VnZiScyynLG7atLIZ2YPkw==/18686200114669622.jpg?param=100y100',
                    followed: e.followed,
                    size: e.albumSize,
                    link: `/artist/${e.id}`
                };
            });
        }
    } catch (e) {
        console.error(e);
    }
    return [];
}

async function getUsers(keywords: string, offset = 0) {
    try {
        const res = await search({
            offset,
            keywords,
            limit: 30,
            type: 1002
        });
        if (res.data.code === 200) {
            return res.data.result.userprofiles.map((e: any) => {
                return {
                    id: e.userId,
                    name: e.nickname,
                    avatar: e.avatarUrl,
                    link: `/user/${e.userId}`
                };
            });
        }
    } catch (e) {
        console.error(e);
    }
    return [];
}

async function searchByType(type: any, keyword: string, offset?: number) {
    let data;
    switch (type.toString()) {
        // Get playlists
        case '1000':
            data = await getPlaylists(keyword, offset);
            break;

        // Get albums
        case '10':
            data = await getAlbums(keyword, offset);
            break;

        // Get artists
        case '100':
            data = await getArtists(keyword, offset);
            break;

        // Get users
        case '1002':
            data = await getUsers(keyword, offset);
            break;
        default:
            data = [];
    }
    return data;
}

export default searchByType;