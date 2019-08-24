import { post } from 'utils/request';

interface IArtistSubQuery {
    id: number;
    t: number;
}

// 收藏与取消收藏歌手
export default (query: IArtistSubQuery) => {
    const t = query.t == 1 ? 'sub' : 'unsub';
    const path = `/weapi/artist/${t}`;
    const data = {
        artistId: query.id,
        artistIds: `[${query.id}]`
    };
    return post(path, data);
};
