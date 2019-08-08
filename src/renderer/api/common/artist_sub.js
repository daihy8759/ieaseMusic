import { post } from 'utils/request';
// 收藏与取消收藏歌手
export default query => {
    query.t = query.t == 1 ? 'sub' : 'unsub';
    const path = `/weapi/artist/${query.t}`;
    const data = {
        artistId: query.id,
        artistIds: `[${query.id}]`
    };
    return post(path, data);
};
