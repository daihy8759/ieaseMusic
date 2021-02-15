import { atom } from 'recoil';

const namespace = 'menu';

export const menuShowState = atom({
    key: `${namespace}:show`,
    default: false,
});
