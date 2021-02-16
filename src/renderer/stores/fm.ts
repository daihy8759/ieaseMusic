import { atom, selector, useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
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
export function useToggleFmNext() {
    const playList = useRecoilValue(fetchFmListState);
    const setPlaylist = useSetRecoilState(playListState);
    const [fmSong, setFmSong] = useRecoilState(fmSongState);
    const setSong = useSetRecoilState(songState);

    const toggleFmNext = () => {
        const songs = playList.songs;
        if (songs) {
            setPlaylist(playList);
            const index = songs.findIndex((d) => d.id === fmSong.id);
            if (index === songs.length - 1) {
                setFmSong(songs[0]);
                setSong(songs[0]);
            } else {
                setFmSong(songs[index + 1]);
                setSong(songs[index + 1]);
            }
        }
    };

    return toggleFmNext;
}

export const personFmState = selector({
    key: `${namespace}:personFm`,
    get: ({ get }) => {
        const controllerPlayList = get(playListState);
        return controllerPlayList.id === 'PERSONAL_FM';
    },
});
