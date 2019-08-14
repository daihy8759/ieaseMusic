import { post } from 'utils/request';

interface ILikeQuery {
    id: number;
    alg?: string;
    like: boolean;
    time?: number;
}
// 红心与取消红心歌曲
export default (query: ILikeQuery) => {
    const path = `/weapi/radio/like?alg=${query.alg || 'itembased'}&trackId=${query.id}&like=${
        query.like
    }&time=${query.time || 25}`;
    const data = {
        trackId: query.id,
        like: query.like
    };
    return post(path, data);
};
