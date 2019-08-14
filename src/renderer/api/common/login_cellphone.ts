import { post } from 'utils/request';
import Crypto from 'utils/crypto';

const { md5 } = Crypto;

export interface ILoginCellphoneQuery {
    phone: string;
    countrycode: string;
    password: string;
}

export default (query: ILoginCellphoneQuery) => {
    const path = '/weapi/login/cellphone';
    const data = {
        phone: query.phone,
        countrycode: query.countrycode,
        password: md5(query.password),
        rememberLogin: 'true'
    };
    return post(path, data);
};
