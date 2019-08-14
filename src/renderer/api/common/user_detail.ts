import { post } from 'utils/request';

interface IUserDetailQuery {
    uid: number;
}
// 用户详情
export default (query: IUserDetailQuery) => {
    const path = `/weapi/v1/user/detail/${query.uid}`;
    return post(path, {});
};
