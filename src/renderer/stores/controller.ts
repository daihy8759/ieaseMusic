import { atom, selector } from 'recoil';
import { PlayMode } from '../../shared/interface/controller';
import { profileState } from './me';
import { getSongUrl } from '/@/api/player';
import IPlayList from '/@/interface/IPlayList';
import ISong from '/@/interface/ISong';

const namespace = 'controller';

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
    key: 'mode',
    default: PlayMode.PLAYER_SHUFFLE,
});

export const toggleModeState = selector({
    key: 'toggleMode',
    get: ({ get }) => get(playModeState),
    set: ({ set }, mode) => {
        set(playModeState, mode as PlayMode);
    },
});

export const playListState = atom({
    key: 'playList',
    default: {} as IPlayList,
});

//  切换播放状态
export const togglePlayState = selector({
    key: 'togglePlay',
    get: ({ get }) => get(playListState),
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
    set: async ({ set }, playListParam) => {
        const { playList, songId } = playListParam as TogglePlayListParam;
        if (!playList) {
            return;
        }
        set(playListState, playList);
        if (playList.songs) {
            let playIndex = 0;
            if (songId) {
                playIndex = playList.songs.findIndex((song) => song.id === songId);
                if (playIndex < 0) {
                    playIndex = 0;
                }
            }
            set(songState, playList.songs[playIndex]);
        }
        set(playingState, true);
    },
});

// 上一首
export const togglePrevState = selector({
    key: 'togglePrev',
    get: ({ get }) => get(playingState),
    set: ({ set, get }) => {
        const playList = get(playListState);
        const songs = playList.songs;
        if (songs) {
            const song = get(songState);
            let index = songs.findIndex((d) => d.id === song.id);
            if (index === 0) {
                index = songs.length - 2;
            }
            set(songState, songs[index - 1]);
        }
        set(playingState, true);
    },
});

// 下一首
export const toggleNextState = selector({
    key: 'toggleNext',
    get: ({ get }) => get(playingState),
    set: ({ set, get }) => {
        const playList = get(playListState);
        const songs = playList.songs;
        if (songs) {
            const song = get(songState);
            const index = songs.findIndex((d) => d.id === song.id);
            if (index === songs.length - 1) {
                set(songState, songs[0]);
            } else {
                set(songState, songs[index + 1]);
            }
        }
        set(playingState, true);
    },
});

// 切换歌曲
export const togglePlaySongState = selector({
    key: `${namespace}:togglePlaySong`,
    get: ({ get }) => get(playingState),
    set: ({ set, get }, songId?) => {
        const playlist = get(playListState);
        const songs = playlist.songs;
        if (songs && songId) {
            const playIndex = songs.findIndex((d) => d.id === songId);
            if (playIndex > -1) {
                set(songState, songs[playIndex]);
            }
        }
        set(playingState, true);
    },
});
