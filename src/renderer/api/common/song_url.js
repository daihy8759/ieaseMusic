import { post } from 'utils/request';

export default query => {
    const path = '/api/song/enhance/player/url';
    const data = {
        ids: `[${query.id}]`,
        br: parseInt(query.br || 999000, 10)
    };
    return post(path, data);
};
