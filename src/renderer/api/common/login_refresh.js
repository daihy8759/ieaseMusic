import { post } from 'utils/request';
// 登录刷新
export default query => {
    const path = `/weapi/login/token/refresh`;
    return post(path, {});
};
