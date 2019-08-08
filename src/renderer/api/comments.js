import commentMusic from './common/comment_music';
import commentLike from './common/comment_like';

async function getMusicComments(songId, offset = 0) {
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
    return [];
}

async function getCommentLike(params) {}

export { getMusicComments, getCommentLike };
