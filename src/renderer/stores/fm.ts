import { atom, DefaultValue, selector, useRecoilCallback } from 'recoil';
import IPlayList from '../interface/IPlayList';
import ISong from '../interface/ISong';
import { playListState, songState } from './controller';
import { getPlaylist } from '/@/api/fm';
import { useMusicApi } from '/@/hooks';
import { profileState } from '/@/stores/me';

const namespace = 'fm';
const musicApi = useMusicApi();

const refreshFmState = atom({
    key: `${namespace}:refreshFm`,
    default: 1,
});

export const fetchFmListState = selector<IPlayList>({
    key: `${namespace}:fetchList`,
    get: async ({ get }) => {
        get(refreshFmState);
        return (await getPlaylist()) as IPlayList;
    },
    set: ({ set }, value) => {
        if (value instanceof DefaultValue) {
            set(refreshFmState, (v) => v + 1);
        }
    },
});

export const fmSongState = atom({
    key: `${namespace}:song`,
    default: {} as ISong,
});

// 下一首
export function useToggleFmNext() {
    return useRecoilCallback(({ set, reset, snapshot: { getPromise } }) => async () => {
        const playList = await getPromise(fetchFmListState);
        const fmSong = await getPromise(fmSongState);

        const songs = playList.songs;
        if (songs) {
            set(playListState, playList);
            const index = songs.findIndex((d) => d.id === fmSong.id);
            if (index === songs.length - 1) {
                set(fmSongState, songs[0]);
                set(songState, songs[0]);
            } else {
                set(fmSongState, songs[index + 1]);
                set(songState, songs[index + 1]);
            }
        }
        reset(fetchFmListState);
    });
}

export const personFmState = selector({
    key: `${namespace}:personFm`,
    get: ({ get }) => {
        const controllerPlayList = get(playListState);
        return controllerPlayList.id === 'PERSONAL_FM';
    },
});

export function useFmTrash() {
    return useRecoilCallback(({ snapshot: { getPromise } }) => async (id: number) => {
        const profile = await getPromise(profileState);
        musicApi.fm_trash({ id, cookie: profile.cookie });
    });
}
