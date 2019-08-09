import axios from 'axios';
import CRYPTO from './crypto';

const { weapi, linuxApi } = CRYPTO;
const host = 'music.163.com';

const request = (method, path, data, crypto = 'weapi') => {
    let cryptoReq = {};
    let url = `https://${host}${path}`;
    switch (crypto) {
        case 'linuxApi':
            cryptoReq = linuxApi({
                method,
                url: url.replace(/\w*api/, 'api'),
                params: data
            });
            url = `https://${host}/api/linux/forward`;
            break;
        case 'eapi':
            break;
        default:
            cryptoReq = weapi(data);
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
    return request('POST', path, data, crypto);
};

const get = (path, data) => {
    return request('GET', path, data);
};

export { request, post, get };
