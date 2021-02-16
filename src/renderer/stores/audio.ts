import { atom } from 'recoil';

const namespace = 'audio';

export const bufferTimeState = atom({
    key: `${namespace}:bufferTime`,
    default: 0,
});
