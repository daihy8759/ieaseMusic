import { atom, selector } from 'recoil';

export const showState = atom({
    key: 'menuShow',
    default: false
});

export const toggleMenuShowState = selector({
    key: 'toggleMenuShow',
    get: ({ get }) => get(showState),
    set: ({ set }, show) => {
        set(showState, show);
    }
});
