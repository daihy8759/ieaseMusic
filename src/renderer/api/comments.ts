import Api from './';

interface MusicCommentResponse {
    newestList?: [];
    hotList?: [];
    total?: number;
    nextOffset?: number;
}

async function getMusicComments(songId: number, offset = 0): Promise<MusicCommentResponse> {
    try {
        const { body } = await Api.comment_music({
            id: songId,
            offset
        });
        if (body.code !== 200) {
            throw body;
        }
        return {
            // @ts-ignore
            newestList: body.comments,
            // @ts-ignore
            hotList: body.hotComments,
            // @ts-ignore
            total: body.total,
            nextOffset: body.more ? offset + 30 : 0
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
