import { post } from 'utils/request';
// 歌手单曲
export default query => {
    const path = `/weapi/v1/artist/${query.id}`;
    return post(path, {});
};
