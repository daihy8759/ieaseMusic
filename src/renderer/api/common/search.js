import { post } from 'utils/request';
// 搜索
export default query => {
    const path = '/weapi/search/get';
    const data = {
        s: query.keywords,
        type: query.type || 1, // 1: 单曲, 10: 专辑, 100: 歌手, 1000: 歌单, 1002: 用户, 1004: MV, 1006: 歌词, 1009: 电台, 1014: 视频
        limit: query.limit || 30,
        offset: query.offset || 0
    };
    return post(path, data);
};
