import { parsePhoneNumberFromString } from 'libphonenumber-js';
import uuid from 'uuid/v4';
import AlbumColors from './albumColors';

const helper = {
    pad(number) {
        return `0${number}`.slice(-2);
    },

    getTime(duration) {
        const minutes = Math.floor(duration / 1000 / 60);
        const second = Math.floor(duration / 1000 - minutes * 60);

        return `${this.pad(minutes)}:${this.pad(second)}`;
    },

    getPallet(image) {
        return new Promise(resolve => {
            const imageWithParam = `${image.replace(/\?.*$/, '')}?param=20y20`;
            new AlbumColors(imageWithParam).getColors().then((colors, err) => {
                if (err) {
                    resolve([[0, 0, 0], [0, 0, 0], [0, 0, 0]]);
                } else {
                    resolve(colors);
                }
            });
        });
    },

    getLyricsKey(times, lyrics) {
        const keys = Object.keys(lyrics);

        return keys.find((e, index) => times > +e && index < keys.length - 1 && times < +keys[index + 1]);
    },

    formatPhone(phone) {
        if (!phone.startsWith('+86') && /1[34578][012356789]\d{8}|134[012345678]\d{7}/.test(phone)) {
            return {
                code: '86',
                phone
            };
        }

        const parsed = parsePhoneNumberFromString(phone);

        if (!parsed) {
            return {};
        }

        return {
            code: parsed.countryCallingCode,
            phone: parsed.nationalNumber
        };
    },

    pureColor(colors = []) {
        const rgb = colors[1] || [255, 255, 255];

        return `
            rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${Math.random()})
        `;
    },

    genColor(colors = []) {
        const r = colors[0] || [255, 255, 255];
        const b = colors[1] || [255, 255, 255];
        const g = colors[2] || [255, 255, 255];

        return `
            linear-gradient(${Math.random() * 100}deg,
                rgba(${r[0]}, ${r[1]}, ${r[2]}, ${Math.random()}) ${Math.random() * 33}%,
                rgba(${g[0]}, ${g[1]}, ${g[2]}, ${Math.random()}) ${Math.random() * 66}%,
                rgba(${b[0]}, ${b[1]}, ${b[2]}, ${Math.random()}) 100%
            )
        `;
    },

    randomName(prefix = 'animation') {
        return `${prefix}-${uuid()}`;
    },

    formatNumber(number = 0) {
        return number
            .toString()
            .split('')
            .reverse()
            .reduce((prev, next, index) => (index % 3 ? next : `${next},`) + prev);
    },

    humanNumber(number) {
        if (number > 1000 * 1000) {
            return `${(number / 1000 / 1000).toFixed(2)}M`;
        }

        if (number > 1000) {
            return `${(number / 1000).toFixed(2)}K`;
        }

        return number;
    },

    clearWith(name, args) {
        let clearName;
        const clear = token => {
            const index = name.indexOf(token);

            if (index !== -1) {
                clearName = name.substring(0, index);
            }

            return clearName;
        };

        args.forEach(e => {
            clearName = clear(e);
        });

        return clearName;
    },

    getRate(song) {
        if (!song.data || !song.data.bitRate) {
            return 'Unknow kbps';
        }

        if (song.data.isFlac) {
            return 'SQ';
        }

        return `${song.data.bitRate / 1000} Kbps`;
    }
};

export default helper;
