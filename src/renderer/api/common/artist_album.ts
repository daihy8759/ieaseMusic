import { post } from 'utils/request';

interface IArtistAlbumQuery {
    id: number;
    limit?: number;
    offset?: number;
}
// 歌手专辑列表
export default (query: IArtistAlbumQuery) => {
    const path = `/weapi/artist/albums/${query.id}`;
    const data = {
        limit: query.limit || 30,
        offset: query.offset || 0,
        total: true
    };
    return post(path, data);
};
