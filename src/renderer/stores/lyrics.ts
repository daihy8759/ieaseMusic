import { profileState } from '/@/stores/me';
import getLyric from '/@/api/lyrics';
import { selectorFamily } from 'recoil';

export const fetchLyricState = selectorFamily({
    key: 'fetchLyric',
    get: (id: number) => async ({ get }) => {
        if (!id) {
            return {
                list: [],
            };
        }
        console.log('load lyric:', id);
        const profile = get(profileState);
        const data = await getLyric(id, profile.cookie);
        return {
            list: data,
        };
    },
});
