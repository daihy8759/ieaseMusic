import { atom, selector } from 'recoil';
import IPlayList from '../interface/IPlayList';
import ISong from '../interface/ISong';
import { playListState, songState } from './controller';
import { getPlaylist } from '/@/api/fm';

const namespace = 'fm';

export const fetchFmListState = selector({
    key: `${namespace}:fetchList`,
    get: async () => {
        return (await getPlaylist()) as IPlayList;
    },
});

export const fmSongState = atom({
    key: `${namespace}:song`,
    default: {} as ISong,
});

// 下一首
export const toggleFmNextState = selector({
    key: `${namespace}:toggleNext`,
    get: ({ get }) => get(fmSongState),
    set: ({ set, get }) => {
        const playList = get(fetchFmListState);
        const songs = playList.songs;
        if (songs) {
            set(playListState, playList);
            const song = get(fmSongState);
            const index = songs.findIndex((d) => d.id === song.id);
            if (index === songs.length - 1) {
                set(fmSongState, songs[0]);
                set(songState, songs[0]);
            } else {
                set(fmSongState, songs[index + 1]);
                set(songState, songs[index + 1]);
            }
        }
    },
});

export const personFmState = selector({
    key: `${namespace}:personFm`,
    get: ({ get }) => {
        const controllerPlayList = get(playListState);
        return controllerPlayList.id === 'PERSONAL_FM';
    },
});
