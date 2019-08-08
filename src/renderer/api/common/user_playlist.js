import { post } from 'utils/request';

export default query => {
    const path = '/weapi/user/playlist';
    const data = {
        uid: query.uid,
        limit: query.limit || 30,
        offset: query.offset || 0
    };
    return post(path, data);
};
