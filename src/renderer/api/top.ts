import { useMusicApi } from '../hooks';

const musicApi = useMusicApi();

async function getTopList() {
    try {
        const { body } = await musicApi.toplist({});
        if (body.code === 200) {
            const list: any = body.list;
            return list.map((data: any) => {
                return {
                    name: data.name,
                    played: data.playCount,
                    updateTime: data.updateTime,
                    size: data.trackCount,
                    link: `/player/0/${data.id}`,
                    cover: data.coverImgUrl,
                };
            });
        }
    } catch (e) {
        console.error(e);
    }
    return [];
}

export { getTopList };
