import { getSongUrl } from 'api/player';
import IPlayList from 'interface/IPlayList';
import ISong from 'interface/ISong';
import { atom, selector } from 'recoil';
import { profileState } from './me';

const PLAYER_SHUFFLE = 0;
const PLAYER_REPEAT = 1;
const PLAYER_LOOP = 2;
export const MODES = [PLAYER_SHUFFLE, PLAYER_REPEAT, PLAYER_LOOP];
export { PLAYER_LOOP, PLAYER_SHUFFLE, PLAYER_REPEAT };

export const songState = atom({
    key: 'song',
    default: {} as ISong,
});

export const songDetailState = selector({
    key: 'songDetail',
    get: async ({ get }) => {
        const song = get(songState);
        const profile = get(profileState);
        const data = await getSongUrl({
            id: song.id,
            cookie: profile.cookie,
        });
        return {
            data,
        };
    },
});

export const playingState = atom({
    key: 'playing',
    default: false,
});

export const playModeState = atom({
    key: 'mode',
    default: PLAYER_SHUFFLE,
});

export const toggleModeState = selector({
    key: 'toggleMode',
    get: ({ get }) => get(playModeState),
    set: ({ set }, mode) => {
        set(playModeState, mode);
    },
});

export const playListState = atom({
    key: 'playList',
    default: {} as IPlayList,
});

//  切换播放状态
export const togglePlayState = selector({
    key: 'togglePlay',
    get: () => {},
    set: ({ set, get }) => {
        const playing = get(playingState);
        set(playingState, !playing);
    },
});

interface TogglePlayListParam {
    playList: IPlayList;
    songId?: number;
}

// 切换播放列表
export const togglePlayListState = selector({
    key: 'togglePlayList',
    get: () => {
        return {
            playList: [],
            songId: 0,
        } as TogglePlayListParam;
    },
    set: ({ set }, playListParam: TogglePlayListParam) => {
        const { playList, songId } = playListParam;
        set(playListState, playList);
        let playIndex = 0;
        if (songId) {
            playIndex = playListParam.playList.songs.findIndex((song) => song.id === songId);
            if (playIndex < 0) {
                playIndex = 0;
            }
        }
        set(songState, playListParam.playList.songs[playIndex]);
        set(playingState, true);
    },
});

// 上一首
export const togglePrevState = selector({
    key: 'togglePrev',
    get: () => {},
    set: ({ set, get }) => {
        const playList = get(playListState);
        const song = get(songState);
        let index = playList.songs.findIndex((d) => d.id === song.id);
        console.log(playList.songs.length);
        if (index === 0) {
            index = playList.songs.length - 2;
        }
        set(songState, playList.songs[index - 1]);
        set(playingState, true);
    },
});

// 下一首
export const toggleNextState = selector({
    key: 'toggleNext',
    get: () => {},
    set: ({ set, get }) => {
        const playList = get(playListState);
        const song = get(songState);
        const index = playList.songs.findIndex((d) => d.id === song.id);
        if (index === playList.songs.length - 1) {
            set(songState, playList.songs[0]);
        } else {
            set(songState, playList.songs[index + 1]);
        }
        set(playingState, true);
    },
});

export const togglePlaySongState = selector({
    key: 'togglePlaySong',
    get: () => 0,
    set: ({ set, get }, songId: number) => {
        const playList = get(playListState);
        const index = playList.songs.findIndex((d) => d.id === songId);
        if (index === playList.songs.length - 1) {
            set(songState, playList.songs[0]);
        } else {
            set(songState, playList.songs[index + 1]);
        }
        set(playingState, true);
    },
});
