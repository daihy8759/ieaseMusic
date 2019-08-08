import { post } from 'utils/request';
// 相似用户
export default query => {
    const path = '/weapi/discovery/simiUser';
    const data = {
        songid: query.id,
        limit: query.limit || 50,
        offset: query.offset || 0
    };
    return post(path, data);
};
