import { post } from 'utils/request';

interface ICommentMusicQuery {
    id: number;
    limit?: number;
    offset?: number;
    before?: number;
}

export default (query: ICommentMusicQuery) => {
    const path = `/api/v1/resource/comments/R_SO_4_${query.id}`;
    const data = {
        rid: query.id,
        limit: query.limit || 20,
        offset: query.offset || 0,
        beforeTime: query.before || 0
    };
    return post(path, data);
};
