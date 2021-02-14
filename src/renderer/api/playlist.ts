import { useMusicApi } from '../hooks';

const limit = 50;
const musicApi = useMusicApi();

async function getPlayList(cat: string, offset?: number) {
    let playList = [];
    let nextOffset = offset;
    try {
        const { body } = await musicApi.top_playlist({ cat, offset, limit });
        if (body.code !== 200) {
            throw body;
        }
        // @ts-ignore
        playList = body.playlists.map((e: any) => {
            const { creator } = e;
            let user = {};
            if (creator) {
                user = {
                    id: creator.userId,
                    name: creator.nickname,
                    link: `/user/${creator.userId}`,
                };
            }

            return {
                id: e.id,
                name: e.name,
                played: e.playCount,
                size: e.trackCount,
                link: `/player/0/${e.id}`,
                cover: `${e.coverImgUrl}?param=100y100`,
                user,
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
        nextOffset,
    };
}

export default getPlayList;
