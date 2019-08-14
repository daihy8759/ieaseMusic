import { post } from 'utils/request';
// 所有榜单介绍
export default () => {
    const path = '/weapi/toplist';
    return post(path, {});
};
