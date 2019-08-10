import { post } from 'utils/request';
// 用户详情
export default query => {
    const path = `/weapi/v1/user/detail/${query.uid}`;
    return post(path, {});
};
