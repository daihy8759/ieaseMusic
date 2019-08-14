import { post } from 'utils/request';

interface IArtistSubQuery {
    id: number;
    t: number | string;
}

// 收藏与取消收藏歌手
export default (query: IArtistSubQuery) => {
    query.t = query.t == 1 ? 'sub' : 'unsub';
    const path = `/weapi/artist/${query.t}`;
    const data = {
        artistId: query.id,
        artistIds: `[${query.id}]`
    };
    return post(path, data);
};
