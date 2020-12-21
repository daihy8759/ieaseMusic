import { parsePhoneNumberFromString } from 'libphonenumber-js';
import AlbumColors from './albumColors';

const helper = {
    pad(number: number) {
        return ('0' + number).slice(-2);
    },
    getTime(duration: number) {
        const minutes = Math.floor(duration / 1000 / 60);
        const second = Math.floor(duration / 1000 - minutes * 60);

        return `${this.pad(minutes)}:${this.pad(second)}`;
    },
    getPallet(image: string) {
        const imageWithParam = `${image.replace(/\?.*$/, '')}?param=20y20`;
        return new AlbumColors(imageWithParam).getColors();
    },
    getLyricsKey(times: any, lyrics: any) {
        const keys = Object.keys(lyrics);
        return keys.find((e, index) => times > +e && index < keys.length - 1 && times < +keys[index + 1]);
    },
    formatPhone(phone: string) {
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
    formatNumber(number = 0) {
        return number
            .toString()
            .split('')
            .reverse()
            .reduce((prev, next, index) => (index % 3 ? next : `${next},`) + prev);
    },
    humanNumber(number: number) {
        if (number > 1000 * 1000) {
            return `${(number / 1000 / 1000).toFixed(2)}M`;
        }

        if (number > 1000) {
            return `${(number / 1000).toFixed(2)}K`;
        }

        return number;
    },
    getRate(song: any) {
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
