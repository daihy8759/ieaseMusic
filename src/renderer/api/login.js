import loginCellPhone from './common/login_cellphone';
import loginRefreshApi from './common/login_refresh';

async function loginWithPhone(query) {
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

export { loginWithPhone, loginRefresh };
