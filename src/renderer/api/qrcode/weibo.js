import url from 'url';
import axios from 'axios';

export default {
    async qrcode(response) {
        const q = url.parse(response.request.responseURL, true);
        const { state } = q.query;
        const res = await axios.get(`https://api.weibo.com/oauth2/qrcode_authorize/generate`, {
            params: {
                client_id: '301575942',
                redirect_uri: 'http://music.163.com/back/weibo',
                scope: 'friendships_groups_read,statuses_to_me_read,follow_app_official_microblog',
                response_type: 'code',
                state,
                _rnd: +new Date()
            }
        });

        return {
            state,
            ticket: res.data.vcode,
            url: res.data.url
        };
    },

    async polling(ticket) {
        const response = await axios.get('https://api.weibo.com/oauth2/qrcode_authorize/query', {
            params: {
                _rnd: Date.now(),
                vcode: ticket
            }
        });
        /**
         * 1: continue
         * 2: scanned
         * 3: done
         * */
        switch (+response.data.status) {
            case 1:
            case 2:
                return this.polling(ticket);
            case 3:
                const q = url.parse(response.body.url, true);
                return q.query.code;
            default:
                throw Error('An error occurred while login by weibo');
        }
    }
};
