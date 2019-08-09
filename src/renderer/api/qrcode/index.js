import axios from 'axios';
import wechat from './wechat';
import weibo from './weibo';

const adaptors = {
    '10': wechat,
    '2': weibo
};

export default {
    async generate(type) {
        const adaptor = adaptors[type];
        const response = await axios.get(
            `http://music.163.com/api/sns/authorize?snsType=${type}&clientType=web2&callbackType=Login&forcelogin=true`
        );
        const payload = await adaptor.qrcode(response);
        return payload;
    },
    async polling(data) {
        try {
            const { ticket, state, type } = data;
            const adaptor = adaptors[type];
            const code = await adaptor.polling(ticket);

            let reqType = '';
            switch (+type) {
                case 10:
                    reqType = 'weichat';
                    break;
                case 2:
                    reqType = 'weibo';
                    break;
                default:
                    throw Error('Unknow type: %d', type);
            }
            const res = await axios.get(`http://music.163.com/back/${reqType}?code=${code}&state=${state}`);
            console.log(res);
            return { success: true };
        } catch (e) {
            console.error(e);
        }
    }
};
