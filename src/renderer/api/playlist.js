import topPlayList from './common/top_playlist';

const limit = 50;

async function getPlayList(cat, offset) {
    let playList = [];
    let nextOffset = offset;
    try {
        const res = await topPlayList({ cat, offset, limit });
        const { data } = res;
        if (data.code !== 200) {
            throw data;
        }
        playList = data.playlists.map(e => {
            const { creator } = e;

            return {
                id: e.id,
                name: e.name,
                played: e.playCount,
                size: e.trackCount,
                link: `/player/0/${e.id}`,
                cover: `${e.coverImgUrl}?param=100y100`,
                user: {
                    id: creator.userId,
                    name: creator.nickname,
                    link: `/user/${creator.userId}`
                }
            };
        });
        if (data.more) {
            nextOffset += limit;
        }
    } catch (e) {
        console.error(e);
    }
    return {
        playList,
        nextOffset
    };
}

export default getPlayList;
