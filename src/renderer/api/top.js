import topList from './common/toplist';

async function getTopList() {
    try {
        const res = await topList();
        if (res.data.code === 200) {
            return res.data.list.map(data => {
                return {
                    name: data.name,
                    played: data.playCount,
                    updateTime: data.updateTime,
                    size: data.trackCount,
                    link: `/player/0/${data.id}`,
                    cover: data.coverImgUrl
                };
            });
        }
    } catch (e) {
        console.error(e);
    }
    return [];
}

export { getTopList };
