import { post } from 'utils/request';

interface IPersonalizedQuery {
    limit?: number;
    offset?: number;
}

export default (query: IPersonalizedQuery) => {
    const path = '/weapi/personalized/playlist';
    const data = {
        limit: query.limit || 30,
        offset: query.offset || 0,
        total: true,
        n: 1000
    };
    return post(path, data);
};
