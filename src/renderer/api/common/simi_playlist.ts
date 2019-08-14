import { post } from 'utils/request';

interface ISimiPlaylistQuery {
    id: number;
    limit?: number;
    offset?: number;
}
// 相似歌曲
export default (query: ISimiPlaylistQuery) => {
    const path = '/weapi/discovery/simiPlaylist';
    const data = {
        songid: query.id,
        limit: query.limit || 50,
        offset: query.offset || 0
    };
    return post(path, data);
};
