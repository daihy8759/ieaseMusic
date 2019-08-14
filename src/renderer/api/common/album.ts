import { post } from 'utils/request';

interface IAlbumQuery {
    id: number;
}

export default (query: IAlbumQuery) => {
    return post(`/weapi/v1/album/${query.id}`, {});
};
