import { atom } from 'recoil';

const namespace = 'share';

export const shareShowState = atom({
    key: `${namespace}:show`,
    default: false,
});
