import { post } from 'utils/request';

interface IArtistsQuery {
    id: number;
}
// 歌手单曲
export default (query: IArtistsQuery) => {
    const path = `/weapi/v1/artist/${query.id}`;
    return post(path, {});
};
