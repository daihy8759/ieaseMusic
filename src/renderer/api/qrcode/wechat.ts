import * as url from 'url';
import axios, { AxiosResponse } from 'axios';

export default {
    qrcode(response: AxiosResponse) {
        const matched = response.data.match(/(\/connect\/qrcode\/[\w-_]+)/);
        const q = url.parse(response.request.responseURL, true);

        if (!matched) {
            throw Error('Failed to generate wechat QRCode.');
        }

        const ticket = matched[1].split('/')[3];

        return {
            ticket,
            url: `https://open.weixin.qq.com/connect/qrcode/${ticket}`,
            state: q.query.state,
            success: true
        };
    },
    async polling(ticket: string) {
        const response = await axios.get(
            `https://long.open.weixin.qq.com/connect/l/qrconnect?uuid=${ticket}&_=${Date.now()}`
        );
        const matched = response.data.match(/wx_errcode=(\d+).*'(.*)';$/);

        if (!matched) {
            throw Error('Invalid wechat ticket');
        }

        /**
         * 408: continue
         * 404: scanned
         * 403: canceled
         * 405: done
         * */
        const res = {
            errorCode: +matched[1],
            code: matched[2]
        };

        switch (res.errorCode) {
            case 405:
                return res.code;
            case 408:
            case 404:
                return this.polling(ticket);
            case 403:
                throw Error('Login by wechat, canceled');
            default:
                throw Error('An error occurred while login by wechat');
        }
    }
};
