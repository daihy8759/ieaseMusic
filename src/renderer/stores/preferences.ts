import { atom, selector } from 'recoil';

const namespace = 'preferences';

export const autoPlayState = atom({
    key: `${namespace}:autoPlay`,
    default: false,
});

export const preferencesShowState = atom({
    key: `${namespace}:show`,
    default: false,
});

export const togglePreferenceShowState = selector({
    key: 'togglePreferencesShow',
    get: () => {},
    set: ({ set, get }) => {
        const show = get(showState);
        set(showState, !show);
    },
});

export const volumeState = atom({
    key: 'volume',
    default: 1,
});
