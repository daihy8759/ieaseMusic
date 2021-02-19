import { useMusicApi } from '../hooks';

interface MusicCommentResponse {
    newestList: MusicComment[];
    hotList: MusicComment[];
    total?: number;
    nextOffset: number;
}

interface CommentUser {
    userId: number;
    nickname: string;
    avatarUrl: string;
}

export interface MusicComment {
    commentId: number;
    content: string;
    beReplied: [];
    liked: boolean;
    likedCount: number;
    time: number;
    user: CommentUser;
}

const musicApi = useMusicApi();

async function getMusicComments(songId: number, offset = 0): Promise<MusicCommentResponse> {
    try {
        const { body } = await musicApi.comment_music({
            id: songId,
            offset,
        });
        if (body.code !== 200) {
            throw body;
        }
        return {
            newestList: body.comments,
            hotList: body.hotComments,
            total: body.total,
            nextOffset: body.more ? offset + 30 : 0,
        };
    } catch (e) {
        console.error(e);
    }
    return {
        newestList: [],
        hotList: [],
        total: 0,
        nextOffset: 0,
    };
}

export { getMusicComments };
