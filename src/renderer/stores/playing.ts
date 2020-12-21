import ISong from 'interface/ISong';
import { atom, selector } from 'recoil';

export const playingShowState = atom({
    key: 'playingShow',
    default: false
});

export const togglePlayingShowState = selector({
    key: 'togglePlayingShow',
    get: ({ get }) => get(playingShowState),
    set: ({ set }, show) => {
        set(playingShowState, show);
    }
});

export const filteredSongsState = atom({
    key: 'filteredSongs',
    default: [] as ISong[]
});
