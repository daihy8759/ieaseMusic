import { post } from 'utils/request';
// 歌单详情
export default query => {
    const path = '/weapi/v3/playlist/detail';
    const data = {
        id: query.id,
        n: 100000,
        s: query.s || 8
    };
    return post(path, data);
};
