import { post } from 'utils/request';

export default () => {
    const path = '/api/discovery/newAlbum';
    return post(path, {});
};
