import { post } from 'utils/request';
// 登录状态
export default () => {
    const path = `/`;
    return post(path, {});
};
