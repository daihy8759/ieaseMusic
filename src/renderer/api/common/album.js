import { post } from 'utils/request';

export default query => {
    return post(`/weapi/v1/album/${query.id}`, {});
};
