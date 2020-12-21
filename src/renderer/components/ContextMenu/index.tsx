import {
    PLAYER_LOOP,
    PLAYER_REPEAT,
    PLAYER_SHUFFLE,
    playingState,
    playListState,
    playModeState,
    songState,
    toggleModeState,
    toggleNextState,
    togglePlayState,
} from '@/stores/controller';
import { isLiked, loginState, toggleLikeState } from '@/stores/me';
import { toggleMenuShowState } from '@/stores/menu';
import { playingShowState } from '@/stores/playing';
import { togglePreferenceShowState } from '@/stores/preferences';
import { ipcRenderer, Menu, remote, shell } from 'electron';
import React, { MutableRefObject, useEffect } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { useEvent } from 'react-use';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';

const ContextMenu = ({ navigatorRef }: { navigatorRef: MutableRefObject<RouteComponentProps> }) => {
    const playList = useRecoilValue(playListState);
    const song = useRecoilValue(songState);
    const playing = useRecoilValue(playingState);
    const mode = useRecoilValue(playModeState);
    const hasLogin = useRecoilValue(loginState);

    const toggleNext = useSetRecoilState(toggleNextState);
    const togglePrev = useSetRecoilState(toggleNextState);
    const togglePlay = useSetRecoilState(togglePlayState);
    const toggleMode = useSetRecoilState(toggleModeState);
    const toggleLike = useSetRecoilState(toggleLikeState);
    const toggleMenuShow = useSetRecoilState(toggleMenuShowState);
    const togglePreferenceShow = useSetRecoilState(togglePreferenceShowState);
    const [playingShow, setPlayingShow] = useRecoilState(playingShowState);

    useEffect(() => {
        ipcRenderer.on('player-toggle', () => {
            if (navigatorRef.current.history.location.pathname === '/search' || playingShow) {
                return;
            }
            togglePlay();
        });
        ipcRenderer.on('player-pause', () => {
            if (playing) {
                togglePlay();
            }
        });
        // Play the next song
        ipcRenderer.on('player-next', () => {
            const FMPlaying = isFMPlaying();

            if (FMPlaying) {
                fm.next();
            } else {
                toggleNext();
            }
        });
        // Go the home screen
        ipcRenderer.on('show-home', () => {
            navigatorRef.current.history.push('/');
        });
        // Show personal FM channel
        ipcRenderer.on('show-fm', () => {
            navigatorRef.current.history.push('/fm');
        });
        // Show preferences screen
        ipcRenderer.on('show-preferences', () => {
            togglePreferenceShow();
        });
        // SHow slide menu panel
        ipcRenderer.on('show-menu', () => {
            toggleMenuShow(true);
        });
        // Show the next up
        ipcRenderer.on('show-playing', () => {
            setPlayingShow(true);
        });
    }, []);

    const isFMPlaying = () => playList.id === fm.playlist.id;

    const handleContextMenu = () => {
        const navigator = navigatorRef.current;
        // const isFMPlaying = () => playList.id === fm.playlist.id;
        const isFMPlaying = () => false;

        const contextmenu = Menu.buildFromTemplate([
            {
                label: playing ? 'Pause' : 'Play',
                click: () => {
                    togglePlay();
                },
            },
            {
                label: 'Next',
                click: () => {
                    if (isFMPlaying()) {
                        fm.next();
                    } else {
                        toggleNext();
                    }
                },
            },
            {
                label: 'Previous',
                click: () => {
                    togglePrev();
                },
            },
            {
                type: 'separator',
            },
            {
                label: 'Menu',
                click: () => {
                    toggleMenuShow(true);
                },
            },
            {
                label: 'Next Up',
                click: () => {
                    setPlayingShow(true);
                },
            },
            {
                type: 'separator',
            },
            {
                label: 'Like/Unlike 💖',
                enabled: hasLogin,
                click: () => {
                    toggleLike({
                        id: song.id,
                        like: !isLiked(song.id),
                    });
                },
            },
            {
                label: 'Ban 💩',
                enabled: hasLogin && playList.id === 'PERSONAL_FM',
                click: () => {
                    fm.ban(song.id);
                },
            },
            {
                label: 'Download 🍭',
                click: () => {
                    ipcRenderer.send('download', { songs: JSON.stringify(song) });
                },
            },
            {
                type: 'separator',
            },
            {
                label: 'Repeat 🤘',
                type: 'checkbox',
                checked: mode === PLAYER_LOOP,
                click: () => {
                    if (mode === PLAYER_LOOP) {
                        toggleMode(PLAYER_REPEAT);
                    } else {
                        toggleMode(PLAYER_LOOP);
                    }
                },
            },
            {
                label: 'Shuffle ⚡️',
                type: 'checkbox',
                checked: mode === PLAYER_SHUFFLE,
                enabled: !isFMPlaying(),
                click: () => {
                    toggleMode(PLAYER_SHUFFLE);
                },
            },
            {
                type: 'separator',
            },
            {
                label: 'Preferences...',
                click: () => {
                    togglePreferenceShow();
                },
            },
            {
                type: 'separator',
            },
            {
                label: 'Home',
                click: () => {
                    navigator.history.push('/');
                },
            },
            {
                label: 'Search',
                click: () => {
                    navigator.history.push('/search');
                },
            },
            {
                label: 'Playlist',
                click: () => {
                    navigator.history.push('/playlist/全部');
                },
            },
            {
                label: 'Made For You',
                click: () => {
                    navigator.history.push('/fm');
                },
            },
            {
                type: 'separator',
            },
            {
                label: 'Show Comments 💬',
                click: () => {
                    navigator.history.push('/comments');
                },
            },
            {
                label: 'Show Lyrics 🎤',
                click: () => {
                    navigator.history.push('/lyrics');
                },
            },
            {
                label: 'Show Cover 💅',
                click: () => {
                    navigator.history.push('/cover');
                },
            },
            {
                label: 'Show Downloads 🚚',
                click: () => {
                    ipcRenderer.send('download-show');
                },
            },
            {
                type: 'separator',
            },
            {
                label: 'Minimize 👇',
                click: () => {
                    ipcRenderer.send('minimize');
                },
            },
            {
                label: 'Goodbye 😘',
                click: () => {
                    ipcRenderer.send('goodbye');
                },
            },
            {
                type: 'separator',
            },
            {
                label: 'Bug report 🐛',
                click: () => {
                    shell.openExternal('https://github.com/daihy8759/ieaseMusic/issues');
                },
            },
            {
                label: 'Fork me on Github 🚀',
                click: () => {
                    shell.openExternal('https://github.com/daihy8759/ieaseMusic');
                },
            },
        ]);
        contextmenu.popup({
            window: remote.getCurrentWindow(),
        });
    };

    useEvent('contextmenu', handleContextMenu);
    return <></>;
};

export default ContextMenu;
