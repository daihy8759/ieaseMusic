import { atom, selector } from 'recoil';
import ISong from '/@/interface/ISong';

export const playingShowState = atom({
    key: 'playingShow',
    default: false,
});

export const togglePlayingShowState = selector({
    key: 'togglePlayingShow',
    get: ({ get }) => get(playingShowState),
    set: ({ set }, show) => {
        set(playingShowState, show as boolean);
    },
});

export const filteredSongsState = atom({
    key: 'filteredSongs',
    default: [] as ISong[],
});
