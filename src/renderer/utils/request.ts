import axios, { AxiosRequestConfig, Method } from 'axios';
import CRYPTO from './crypto';

const { weapi, linuxApi } = CRYPTO;
const host = 'music.163.com';

const request = (method: Method, path: string, data: any, crypto = 'weapi') => {
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
    const options: AxiosRequestConfig = {
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

const post = (path: string, data: any, crypto?: string) => {
    return request('POST', path, data, crypto);
};

const get = (path: string, data: any) => {
    return request('GET', path, data);
};

export { request, post, get };
