import { post } from 'utils/request';

interface ISimiUserQuery {
    id: number;
    limit?: number;
    offset?: number;
}
// 相似用户
export default (query: ISimiUserQuery) => {
    const path = '/weapi/discovery/simiUser';
    const data = {
        songid: query.id,
        limit: query.limit || 50,
        offset: query.offset || 0
    };
    return post(path, data);
};
