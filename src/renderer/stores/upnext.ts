import ISong from '/@/interface/ISong';
import { atom } from 'recoil';

export const upNextShowState = atom({
    key: 'upNextShow',
    default: false,
});

export const upNextSongState = atom<ISong>({
    key: 'upNextSong',
    default: {
        album: {},
        artists: [],
    },
});
