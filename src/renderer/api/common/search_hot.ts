import { post } from 'utils/request';
// 热门搜索
export default () => {
    const path = '/weapi/search/hot';
    const data = {
        type: 1111
    };
    return post(path, data);
};
