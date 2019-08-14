import { post } from 'utils/request';

interface IArtistDescQuery {
    id: number;
}
// 歌手介绍
export default (query: IArtistDescQuery) => {
    const path = `/weapi/artist/introduction`;
    const data = {
        id: query.id
    };
    return post(path, data);
};
