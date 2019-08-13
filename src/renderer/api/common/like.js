import { post } from 'utils/request';
// 红心与取消红心歌曲
export default query => {
    const path = `/weapi/radio/like?alg=${query.alg || 'itembased'}&trackId=${query.id}&like=${
        query.like
    }&time=${query.time || 25}`;
    const data = {
        trackId: query.id,
        like: query.like
    };
    return post(path, data);
};
