import { selectorFamily } from 'recoil';
import { getUserDetail } from '/@/api/user';
import { profileState } from '/@/stores/me';

export const userDetailQueryState = selectorFamily({
    key: 'userQuery',
    get: (id: number) => async ({ get }: any) => {
        const userProfile = get(profileState);
        const data = await getUserDetail(id, userProfile.cookie);
        const { profile, playlists } = data;
        return {
            profile,
            playlists,
        };
    },
});
