import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useEvent } from 'react-use';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import {
    IPC_CONTEXTMENU,
    IPC_NAVIGATOR,
    IPC_PLAYER_NEXT,
    IPC_PLAYER_PAUSE,
    IPC_PLAYER_TOGGLE,
    IPC_PREFERENCE,
    IPC_SONG_LIKE,
} from '../../../shared/ipc';
import { useChannel, useIpc } from '/@/hooks';
import ISong from '/@/interface/ISong';
import { playingState, playListState, playModeState, toggleNextState, togglePlaySongState } from '/@/stores/controller';
import { fetchFmListState, toggleFmNextState } from '/@/stores/fm';
import { loginState, toggleLikeState } from '/@/stores/me';
import { playingShowState } from '/@/stores/playing';
import { togglePreferenceShowState } from '/@/stores/preferences';

const ipc = useIpc();
const channel = useChannel();

const ContextMenu = () => {
    const logined = useRecoilValue(loginState);
    const togglePreferenceShow = useSetRecoilState(togglePreferenceShowState);
    const playing = useRecoilValue(playingState);
    const playMode = useRecoilValue(playModeState);
    const playList = useRecoilValue(playListState);
    const togglePlaySong = useSetRecoilState(togglePlaySongState);
    const toggleNext = useSetRecoilState(toggleNextState);
    const toggleLike = useSetRecoilState(toggleLikeState);
    const toggleFmNext = useSetRecoilState(toggleFmNextState);
    const playingShow = useRecoilValue(playingShowState);
    const fmList = useRecoilValue(fetchFmListState);
    const history = useHistory();

    useEffect(() => {
        channel.listen(IPC_NAVIGATOR, (...args: any) => {
            if (args[0]) {
                history.push(args[0]);
            }
        });
        channel.listen(IPC_PLAYER_TOGGLE, () => {
            if (history.location.pathname === '/search' || playingShow) {
                return;
            }
            togglePlaySong(null);
        });
        channel.listen(IPC_PLAYER_PAUSE, () => {
            if (playing) {
                togglePlaySong(null);
            }
        });
        channel.listen(IPC_PLAYER_NEXT, () => {
            const FMPlaying = isFMPlaying();
            if (FMPlaying) {
                toggleFmNext({} as ISong);
            } else {
                toggleNext(true);
            }
        });
        channel.listen(IPC_SONG_LIKE, () => toggleLike(null));
        channel.listen(IPC_PREFERENCE, togglePreferences);
    }, []);

    const isFMPlaying = () => playList.id === fmList.id;

    const togglePreferences = () => {
        togglePreferenceShow();
    };

    const handleContextMenu = () => {
        const isFMPlaying = () => playList.id === fmList.id;

        ipc.invoke(IPC_CONTEXTMENU, {
            playing: playing,
            isLogin: logined,
            playlistId: playList.id,
            playMode: playMode,
            fmPlaying: isFMPlaying(),
        });
    };

    useEvent('contextmenu', handleContextMenu);
    return <></>;
};

export default ContextMenu;
