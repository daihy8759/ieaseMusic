import { atom, selector, useRecoilCallback, useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { PlayMode } from '../../shared/interface/controller';
import helper from '../utils/helper';
import { bufferTimeState } from './audio';
import { profileState } from './me';
import { getSongUrl } from '/@/api/player';
import IPlayList from '/@/interface/IPlayList';
import ISong from '/@/interface/ISong';

const namespace = 'controller';

export const PLAY_MODES = [PlayMode.PLAYER_SHUFFLE, PlayMode.PLAYER_REPEAT, PlayMode.PLAYER_LOOP];

export const songState = atom({
    key: `${namespace}:song`,
    default: {} as ISong,
});

export const songDetailState = selector({
    key: `${namespace}:songDetail`,
    get: async ({ get }) => {
        const song = get(songState);
        const profile = get(profileState);
        if (song.id) {
            const data = await getSongUrl(song.id, profile.cookie);
            return {
                ...song,
                data,
            };
        }
        return song;
    },
});

export const playingState = atom({
    key: `${namespace}:playing`,
    default: false,
});

export const playModeState = atom({
    key: `${namespace}:mode`,
    default: PlayMode.PLAYER_SHUFFLE,
});

export const playListState = atom({
    key: `${namespace}:playList`,
    default: {} as IPlayList,
});

//  切换播放状态
export function useTogglePlaying() {
    const [playing, setPlaying] = useRecoilState(playingState);

    return () => {
        setPlaying(!playing);
    };
}

interface TogglePlayListParam {
    playList: IPlayList;
    songId?: number;
}

// 切换播放列表
export function useTogglePlayList() {
    const [currentPlaylist, setPlaylist] = useRecoilState(playListState);
    const setSong = useSetRecoilState(songState);
    const setPlaying = useSetRecoilState(playingState);

    const setPlaylistAsync = async (playListParam: TogglePlayListParam) => {
        const { playList, songId } = playListParam;
        if (!playList) {
            return;
        }
        if (currentPlaylist.id === playList.id) {
            return;
        }
        setPlaylist(playList);
        if (playList.songs) {
            let playIndex = 0;
            if (songId) {
                playIndex = playList.songs.findIndex((song) => song.id === songId);
                if (playIndex < 0) {
                    playIndex = 0;
                }
            }
            setSong(playList.songs[playIndex]);
        }
        setPlaying(true);
    };

    return setPlaylistAsync;
}

// 上一首
export function useTogglePrev() {
    const playList = useRecoilValue(playListState);
    const [song, setSong] = useRecoilState(songState);
    const setPlaying = useSetRecoilState(playingState);

    const setPrev = () => {
        const songs = playList.songs;
        if (songs) {
            let index = songs.findIndex((d) => d.id === song.id);
            if (index === 0) {
                index = songs.length - 2;
            }
            setSong(songs[index - 1]);
        }
        setPlaying(true);
    };

    return setPrev;
}

// 下一首
export function useToggleNext() {
    return useRecoilCallback(({ set, snapshot: { getPromise } }) => async () => {
        const playList = await getPromise(playListState);
        const song = await getPromise(songState);
        const songs = playList.songs;
        if (songs) {
            const index = songs.findIndex((d) => d.id === song.id);
            if (index === songs.length - 1) {
                set(songState, songs[0]);
            } else {
                set(songState, songs[index + 1]);
            }
        }
        set(playingState, true);
    });
}

// 切换歌曲
export function useToggleSong() {
    const playlist = useRecoilValue(playListState);
    const setSong = useSetRecoilState(songState);
    const setPlaying = useSetRecoilState(playingState);

    const setSongAsync = (songId?: number) => {
        const songs = playlist.songs;
        if (songs && songId) {
            const playIndex = songs.findIndex((d) => d.id === songId);
            if (playIndex > -1) {
                setSong(songs[playIndex]);
            }
        }
        setPlaying(true);
    };

    return setSongAsync;
}

// TODO Selectors don't propagate updates if their computed value hasn't changed
// see https://github.com/facebookexperimental/Recoil/pull/749
export const progressBufferTimeState = selector({
    key: `${namespace}:progressBufferTime`,
    get: ({ get }) => {
        const song = get(songState);
        const { duration } = song;
        if (duration) {
            const currentTime = get(bufferTimeState);
            const passedTime = currentTime * 1000;
            const percent = passedTime / duration;
            return {
                percent,
                time: `${helper.getTime(passedTime)} / ${helper.getTime(duration)}`,
            };
        }
        return {
            percent: 0,
            time: '',
        };
    },
});
