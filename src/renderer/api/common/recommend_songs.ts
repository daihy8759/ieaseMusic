import { post } from 'utils/request';

export default () => {
    const path = '/weapi/v1/discovery/recommend/songs';
    const data = {
        limit: 20,
        offset: 0,
        total: true
    };
    return post(path, data);
};
