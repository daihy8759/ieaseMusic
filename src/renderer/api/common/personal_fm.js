import { post } from 'utils/request';
// 私人FM
export default query => {
    const path = `/weapi/v1/radio/get`;
    return post(path, {});
};
