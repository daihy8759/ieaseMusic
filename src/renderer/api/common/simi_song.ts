import { post } from 'utils/request';

interface ISimiSongQuery {
    id: number;
    limit?: number;
    offset?: number;
}
// 相似歌曲
export default (query: ISimiSongQuery) => {
    const path = '/weapi/v1/discovery/simiSong';
    const data = {
        songid: query.id,
        limit: query.limit || 50,
        offset: query.offset || 0
    };
    return post(path, data);
};
