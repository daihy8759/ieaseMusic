import loginCellPhone, { ILoginCellphoneQuery } from './common/login_cellphone';
import loginRefreshApi from './common/login_refresh';
import loginStatus from './common/login_status';

async function loginWithPhone(query: ILoginCellphoneQuery) {
    try {
        const res = await loginCellPhone(query);
        return res.data;
    } catch (e) {
        console.error(e);
    }
    return [];
}

async function loginRefresh() {
    try {
        const res = await loginRefreshApi();
        return res.data;
    } catch (e) {
        console.error(e);
    }
    return {};
}

async function geLoginStatus() {
    try {
        const res = await loginStatus();
        const { data } = res;
        let profile = eval(`(${/GUser\s*=\s*([^;]+);/.exec(data)[1]})`);
        let bindings = eval(`(${/GBinds\s*=\s*([^;]+);/.exec(data)[1]})`);
        return { code: 200, profile: profile, bindings: bindings };
    } catch (e) {
        console.error(e);
    }
    return { code: 301 };
}

export { loginWithPhone, loginRefresh, geLoginStatus };
