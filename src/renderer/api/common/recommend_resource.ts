import { post } from 'utils/request';

export default () => {
    const path = '/weapi/v1/discovery/recommend/resource';
    return post(path, {});
};
