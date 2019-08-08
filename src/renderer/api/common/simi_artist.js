import { post } from 'utils/request';
// 相似歌手
export default query => {
    const path = '/weapi/discovery/simiArtist';
    const data = {
        artistid: query.id
    };
    return post(path, data);
};
