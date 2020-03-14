import axios from 'axios';
import * as qs from 'qs';
import CRYPTO from './crypto';
import ISong from 'interface/ISong';

const { md5 } = CRYPTO;

const BASE_URL = 'https://ws.audioscrobbler.com/2.0/';
const API_KEY = '42ce640ff370c0c2a0f73342222edda6';
const SECRET = '5924b918d8b99fa3942084351de1073d';

let lastFm: any = {};

async function getSession() {
    try {
        const { username, connected, authToken, api_key, api_secret } = lastFm;
        if (!connected) {
            return;
        }
        const sig = `api_key${api_key}authToken${authToken}methodauth.getMobileSessionusername${username}${api_secret}`;
        const apiSig = md5(sig);
        const res = await axios.post(
            BASE_URL,
            qs.stringify({
                api_key,
                method: 'auth.getMobileSession',
                username,
                authToken,
                format: 'json',
                api_sig: apiSig
            })
        );
        const { session } = res.data;
        if (session) {
            lastFm.session_key = session.key;
            return session;
        }
    } catch (e) {
        console.error(e);
    }
    return null;
}

interface IPostFmParam {
    method: string;
    artist: string;
    track: string;
    tags?: string;
}

function postFm({ method, artist, track, tags }: IPostFmParam) {
    const { api_key, session_key, api_secret } = lastFm;
    const timestamp = Math.floor(new Date().getTime() / 1000);
    const sig =
        `api_key${api_key}artist${artist}method${method}sk${session_key}` +
        (tags ? `tags${tags}` : '') +
        `timestamp${timestamp}track${track}${api_secret}`;
    const apiSig = md5(sig);

    return axios.post(
        BASE_URL,
        qs.stringify({
            api_key,
            method,
            sk: session_key,
            timestamp,
            artist,
            track,
            format: 'json',
            api_sig: apiSig
        })
    );
}

async function initialize(username: string, password: string) {
    if (!username || !password) {
        return;
    }

    const authToken = md5(username + md5(password));
    lastFm = {
        api_key: API_KEY,
        api_secret: SECRET,
        authToken,
        username,
        password
    };

    return getSession();
}

async function scrobble(song: ISong) {
    const session = await getSession();

    if (!session) {
        return;
    }
    const res = await postFm({
        method: 'track.scrobble',
        artist: song.artists.map(e => e.name).join(','),
        track: song.name
    });
    return res.data;
}

async function playing(song: ISong) {
    const session = await getSession();

    if (!session) {
        return;
    }
    const res = await postFm({
        method: 'track.updateNowPlaying',
        artist: song.artists.map(e => e.name).join(','),
        track: song.name
    });
    return res.data;
}

async function love(song: ISong) {
    const session = await getSession();

    if (!session) {
        return;
    }
    const res = await postFm({
        method: 'track.love',
        artist: song.artists.map(e => e.name).join(','),
        track: song.name
    });
    return res.data;
}

async function unlove(song: ISong) {
    const session = await getSession();

    if (!session) {
        return;
    }

    const res = await postFm({
        method: 'track.unlove',
        artist: song.artists.map(e => e.name).join(','),
        track: song.name
    });
    return res.data;
}

export default {
    initialize,
    scrobble,
    playing,
    love,
    unlove
};
