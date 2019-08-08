import { post } from 'utils/request';

export default query => {
    const path = `/api/v1/resource/comments/R_SO_4_${query.id}`;
    const data = {
        rid: query.id,
        limit: query.limit || 20,
        offset: query.offset || 0,
        beforeTime: query.before || 0
    };
    return post(path, data);
};
