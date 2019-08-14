import { post } from 'utils/request';
// 私人FM
export default () => {
    const path = `/weapi/v1/radio/get`;
    return post(path, {});
};
