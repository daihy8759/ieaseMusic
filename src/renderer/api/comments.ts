import commentMusic from './common/comment_music';
import commentLike from './common/comment_like';

interface MusicCommentResponse {
    newestList?: [];
    hotList?: [];
    total?: number;
    nextOffset?: number;
}

async function getMusicComments(songId: number, offset = 0): Promise<MusicCommentResponse> {
    try {
        const res = await commentMusic({
            id: songId,
            offset
        });
        if (res.data.code !== 200) {
            throw res.data;
        }
        const { data } = res;
        return {
            newestList: data.comments,
            hotList: data.hotComments,
            total: data.total,
            nextOffset: data.more ? offset + 30 : 0
        };
    } catch (e) {
        console.error(e);
    }
    return {};
}

async function getCommentLike() {
    // try {
    //     const res = await commentLike();
    // } catch (e) {
    //     console.error(e);
    // }
}

export { getMusicComments, getCommentLike };
