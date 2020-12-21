import { atom, selector } from 'recoil';

export const autoPlayState = atom({
    key: 'autoPlay',
    default: false
});

export const showState = atom({
    key: 'preferencesShow',
    default: false
});

export const togglePreferenceShowState = selector({
    key: 'togglePreferencesShow',
    get: () => {},
    set: ({ set, get }) => {
        const show = get(showState);
        set(showState, !show);
    }
});

export const volumeState = atom({
    key: 'volume',
    default: 1
});
