import bigInt from 'big-integer';
import CryptoJS from 'crypto-js';

const MODULUS =
    '00e0b509f6259df8642dbc35662901477df22677ec152b5ff68ace615bb7b725152b3ab17a876aea' +
    '8a5aa76d2e417629ec4ee341f56135fccf695280104e0312ecbda92557c93870114af6c9d05c4f7f' +
    '0c3685b7a46bee255932575cce10b424d813cfe4875d3e82047b97ddef52741d546b8e289dc6935b' +
    '3ece0462db0a22b8e7';
const NONCE = '0CoJUm6Qyw8W8jud';
const PUBLIC_KEY = '010001';
const LINUX_API_KEY = 'rFgB&h#%2?^eDg:Q';

function createSecretKey(size) {
    const keys = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let key = '';
    for (let i = 0; i < size; i++) {
        let pos = Math.random() * keys.length;
        pos = Math.floor(pos);
        key += keys.charAt(pos);
    }
    return key;
}

function aesEncrypt(text, secKey) {
    const newSecKey = CryptoJS.enc.Utf8.parse(secKey);
    const iv = CryptoJS.enc.Utf8.parse('0102030405060708');
    return CryptoJS.AES.encrypt(text, newSecKey, {
        iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    }).toString();
}

function zFill(str, size) {
    return str.padStart(size, '0');
}

function rsaEncrypt(text, pubKey, modulus) {
    const newText = text
        .split('')
        .reverse()
        .join('');
    const biText = bigInt(Buffer.from(newText).toString('hex'), 16);
    const biEx = bigInt(pubKey, 16);
    const biMod = bigInt(modulus, 16);
    const biRet = biText.modPow(biEx, biMod);
    return zFill(biRet.toString(16), 256);
}

// web api
const weapi = data => {
    const text = JSON.stringify(data);
    const secKey = createSecretKey(16);
    const encText = aesEncrypt(aesEncrypt(text, NONCE), secKey);
    const encSecKey = rsaEncrypt(secKey, PUBLIC_KEY, MODULUS);
    return { params: encText, encSecKey };
};
// linux api
const linuxApi = data => {
    const text = JSON.stringify(data);
    return {
        eparams: aesEncrypt(text, LINUX_API_KEY)
    };
};
const eapi = data => {};

function md5(text) {
    return CryptoJS.MD5(text).toString();
}

export default { weapi, linuxApi, md5 };
