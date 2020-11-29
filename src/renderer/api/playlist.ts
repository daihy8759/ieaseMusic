import Api from './';

const limit = 50;

async function getPlayList(cat: string, offset?: number) {
    let playList = [];
    let nextOffset = offset;
    try {
        const { body } = await Api.top_playlist({ cat, offset, limit });
        if (body.code !== 200) {
            throw body;
        }
        // @ts-ignore
        playList = body.playlists.map((e: any) => {
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
        if (body.more) {
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
