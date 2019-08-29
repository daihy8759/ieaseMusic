import { post } from 'utils/request';
// 关注与取消关注用户

interface Follow {
    id: number;
    t: number;
}

export default (query: Follow) => {
    const t = query.t == 1 ? 'follow' : 'delfollow';
    const path = `/weapi/user/${t}/${query.id}`;
    return post(path, {});
};
