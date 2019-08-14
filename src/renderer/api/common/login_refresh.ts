import { post } from 'utils/request';
// 登录刷新
export default () => {
    const path = `/weapi/login/token/refresh`;
    return post(path, {});
};
