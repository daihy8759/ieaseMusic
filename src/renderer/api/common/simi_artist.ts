import { post } from 'utils/request';

interface ISimiArtistQuery {
    id: number;
}
// 相似歌手
export default (query: ISimiArtistQuery) => {
    const path = '/weapi/discovery/simiArtist';
    const data = {
        artistid: query.id
    };
    return post(path, data);
};
