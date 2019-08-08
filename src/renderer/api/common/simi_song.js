import { post } from 'utils/request';
// 相似歌曲
export default query => {
    const path = '/weapi/v1/discovery/simiSong';
    const data = {
        songid: query.id,
        limit: query.limit || 50,
        offset: query.offset || 0
    };
    return post(path, data);
};
