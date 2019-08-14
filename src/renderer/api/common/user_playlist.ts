import { post } from 'utils/request';

interface IUserPlaylistQuery {
    uid: number;
    limit?: number;
    offset?: number;
}
export default (query: IUserPlaylistQuery) => {
    const path = '/weapi/user/playlist';
    const data = {
        uid: query.uid,
        limit: query.limit || 30,
        offset: query.offset || 0
    };
    return post(path, data);
};
