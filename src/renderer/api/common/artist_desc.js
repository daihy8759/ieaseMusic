import { post } from 'utils/request';
// 歌手介绍
export default query => {
    const path = `/weapi/artist/introduction`;
    const data = {
        id: query.id
    };
    return post(path, data);
};
