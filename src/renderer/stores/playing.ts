import { atom } from 'recoil';
import ISong from '/@/interface/ISong';

export const playingShowState = atom({
    key: 'playingShow',
    default: false,
});

export const filteredSongsState = atom({
    key: 'filteredSongs',
    default: [] as ISong[],
});
