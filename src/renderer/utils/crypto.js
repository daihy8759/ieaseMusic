import crypto from 'crypto';

const PRESET_KEY = Buffer.from('0CoJUm6Qyw8W8jud');
const BASE62 = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
const PUBLIC_KEY =
    '-----BEGIN PUBLIC KEY-----\nMIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDgtQn2JZ34ZC28NWYpAUd98iZ37BUrX/aKzmFbt7clFSs6sXqHauqKWqdtLkF2KexO40H1YTX8z2lSgBBOAxLsvaklV8k4cBFK9snQXE9/DDaFt6Rr7iVZMldczhC0JNgTz+SHXT6CBHuX3e9SdB1Ua44oncaTWz7OBGLbCiK45wIDAQAB\n-----END PUBLIC KEY-----';
const LINUX_API_KEY = Buffer.from('rFgB&h#%2?^eDg:Q');
const IV = Buffer.from('0102030405060708');

function aesEncrypt(buffer, mode, key, iv) {
    const cipher = crypto.createCipheriv(`aes-128-${mode}`, key, iv);
    return Buffer.concat([cipher.update(buffer), cipher.final()]);
}

function rsaEncrypt(buffer, key) {
    return crypto.publicEncrypt(
        { key, padding: crypto.constants.RSA_NO_PADDING },
        Buffer.concat([Buffer.alloc(128 - buffer.length), buffer])
    );
}

// web api
const weapi = data => {
    const text = JSON.stringify(data);
    const secretKey = crypto.randomBytes(16).map(n => BASE62.charAt(n % 62).charCodeAt());
    const params = aesEncrypt(
        Buffer.from(aesEncrypt(Buffer.from(text), 'cbc', PRESET_KEY, IV).toString('base64')),
        'cbc',
        secretKey,
        IV
    ).toString('base64');
    const encSecKey = rsaEncrypt(secretKey.reverse(), PUBLIC_KEY).toString('hex');
    return { params, encSecKey };
};
// linux api
const linuxApi = data => {
    const text = JSON.stringify(data);
    return {
        eparams: aesEncrypt(Buffer.from(text), 'ecb', LINUX_API_KEY, '')
            .toString('hex')
            .toUpperCase()
    };
};
const eapi = data => {};

function md5(text) {
    return crypto
        .createHash('md5')
        .update(text)
        .digest('hex');
}

export default { weapi, linuxApi, md5 };
