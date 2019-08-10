import { post } from 'utils/request';
// 分类歌单
export default query => {
    const path = '/weapi/playlist/list';
    const data = {
        cat: query.cat || '全部',
        order: query.order || 'hot', // hot,new
        limit: query.limit || 50,
        offset: query.offset || 0,
        total: true
    };
    return post(path, data);
};
