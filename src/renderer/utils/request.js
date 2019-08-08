import axios from 'axios';
import CRYPTO from './crypto';

const { weapi, linuxApi } = CRYPTO;
const host = 'music.163.com';

const request = (method, path, data, crypto = 'weapi') => {
    let cryptoReq = {};
    let url = `https://${host}${path}`;
    switch (crypto) {
        case 'weapi':
            cryptoReq = weapi(data);
            break;
        case 'linuxApi':
            cryptoReq = linuxApi({
                method,
                url: url.replace(/\w*api/, 'api'),
                params: data
            });
            url = 'https://music.163.com/api/linux/forward';
            break;
        default:
            break;
    }
    const options = {
        method,
        url,
        withCredentials: true,
        headers: {
            Accept: 'application/json;charset=UTF-8',
            'Accept-Language': 'zh-CN,zh;q=0.8,gl;q=0.6,zh-TW;q=0.4',
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        params: cryptoReq
    };
    return axios(options);
};

const post = (path, data, crypto) => {
    return request('post', path, data, crypto);
};

const get = (path, data) => {
    return request('get', path, data);
};

export { request, post, get };
