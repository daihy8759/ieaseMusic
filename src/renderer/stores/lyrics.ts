import { atom, selectorFamily } from 'recoil';
import helper from '../utils/helper';
import { bufferTimeState } from './audio';
import getLyric from '/@/api/lyrics';

const namespace = 'lyrics';

export const scrollLyricState = atom({
    key: `${namespace}:scroll`,
    default: 0,
});

export const fetchLyricState = selectorFamily({
    key: `${namespace}:fetchLyric`,
    get: (id: number) => async ({}) => {
        if (!id) {
            return {
                list: [],
            };
        }
        const data = await getLyric(id);
        return {
            list: data,
        };
    },
});

// TODO Selectors don't propagate updates if their computed value hasn't changed
// see https://github.com/facebookexperimental/Recoil/pull/749
// see https://github.com/facebookexperimental/Recoil/issues/314
export const lyricScrollTimeState = selectorFamily({
    key: `${namespace}:scrollTime`,
    get: (lyrics) => ({ get }) => {
        const bufferTime = get(bufferTimeState);
        return helper.getLyricsKey(bufferTime * 1000, (lyrics as unknown) as string[]);
    },
});
