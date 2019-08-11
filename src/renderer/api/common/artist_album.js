import { post } from 'utils/request';
// 歌手专辑列表
export default query => {
    const path = `/weapi/artist/albums/${query.id}`;
    const data = {
        limit: query.limit || 30,
        offset: query.offset || 0,
        total: true
    };
    return post(path, data);
};
