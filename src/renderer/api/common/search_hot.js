import { post } from 'utils/request';
// 热门搜索
export default query => {
    const path = '/weapi/search/hot';
    const data = {
        type: 1111
    };
    return post(path, data);
};
