import { post } from 'utils/request';

export default query => {
    const path = '/weapi/personalized/playlist';
    const data = {
        limit: query.limit || 30,
        offset: query.limit || 0,
        total: true,
        n: 1000
    };
    return post(path, data);
};
