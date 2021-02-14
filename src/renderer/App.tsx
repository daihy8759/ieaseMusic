import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import { configure } from 'mobx';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { HashRouter } from 'react-router-dom';
import { useEffectOnce, useEvent } from 'react-use';
import './App.less';
import { useStore } from './context';
import { useIpc, useShell } from './hooks';
import MainRouter from './routes';
import { PLAYER_LOOP, PLAYER_REPEAT, PLAYER_SHUFFLE } from '/@/stores/controller';

configure({ enforceActions: 'observed' });

const theme = createMuiTheme({
    palette: {},
});
const shell = useShell();
const ipc = useIpc();

const App = observer(() => {
    const navigatorRef = React.useRef<any>();
    const store = useStore();
    const { controller, playing, fm, menu } = store;

    useEffectOnce(() => {
        // TODO ipc.on
        // ipc.on('player-toggle', () => {
        //     if (navigatorRef.current.history.location.pathname === '/search' || playing.show) {
        //         return;
        //     }
        //     controller.toggle();
        // });
        // ipc.on('player-pause', () => {
        //     if (controller.playing) {
        //         controller.toggle();
        //     }
        // });
        // // Play the next song
        // ipc.on('player-next', () => {
        //     const FMPlaying = isFMPlaying();
        //     if (FMPlaying) {
        //         fm.next();
        //     } else {
        //         controller.next();
        //     }
        // });
        // // Like a song
        // ipc.on('player-like', () => toggleLike());
        // // Go the home screen
        // ipc.on('show-home', () => {
        //     navigatorRef.current.history.push('/');
        // });
        // // Show personal FM channel
        // ipc.on('show-fm', () => {
        //     navigatorRef.current.history.push('/fm');
        // });
        // // Show preferences screen
        // ipc.on('show-preferences', () => {
        //     togglePreferences();
        // });
        // // SHow slide menu panel
        // ipc.on('show-menu', () => {
        //     menu.toggle(true);
        // });
        // // Show the next up
        // ipc.on('show-playing', () => {
        //     playing.toggle(true);
        // });
    });

    const isFMPlaying = () => controller.playlist.id === fm.playlist.id;

    const toggleLike = () => {
        const { controller, me } = store;
        const { song } = controller;

        if (me.likes.get(song.id)) {
            me.unlike(song);
            return;
        }
        me.like(song);
    };

    const togglePreferences = () => {
        const { preferences } = store;
        preferences.toggle();
    };

    const handleContextMenu = () => {
        const { controller, fm, me, menu, playing } = store;
        const navigator = navigatorRef.current;
        const isFMPlaying = () => controller.playlist.id === fm.playlist.id;

        const logined = me.hasLogin();
        const contextmenu = Menu.buildFromTemplate([
            {
                label: controller.playing ? 'Pause' : 'Play',
                click: () => {
                    controller.toggle();
                },
            },
            {
                label: 'Next',
                click: () => {
                    if (isFMPlaying()) {
                        fm.next();
                    } else {
                        controller.next();
                    }
                },
            },
            {
                label: 'Previous',
                click: () => {
                    controller.prev();
                },
            },
            {
                type: 'separator',
            },
            {
                label: 'Menu',
                click: () => {
                    menu.toggle(true);
                },
            },
            {
                label: 'Next Up',
                click: () => {
                    playing.toggle(true);
                },
            },
            {
                type: 'separator',
            },
            {
                label: 'Like/Unlike 💖',
                enabled: logined,
                click: () => {
                    toggleLike();
                },
            },
            {
                label: 'Ban 💩',
                enabled: logined && controller.playlist.id === 'PERSONAL_FM',
                click: () => {
                    fm.ban(controller.song.id);
                },
            },
            {
                label: 'Download 🍭',
                click: () => {
                    ipc.send('download', { songs: JSON.stringify(controller.song) });
                },
            },
            {
                type: 'separator',
            },
            {
                label: 'Repeat 🤘',
                type: 'checkbox',
                checked: controller.mode === PLAYER_LOOP,
                click: () => {
                    if (controller.mode === PLAYER_LOOP) {
                        controller.changeMode(PLAYER_REPEAT);
                    } else {
                        controller.changeMode(PLAYER_LOOP);
                    }
                },
            },
            {
                label: 'Shuffle ⚡️',
                type: 'checkbox',
                checked: controller.mode === PLAYER_SHUFFLE,
                enabled: !isFMPlaying(),
                click: () => {
                    controller.changeMode(PLAYER_SHUFFLE);
                },
            },
            {
                type: 'separator',
            },
            {
                label: 'Preferences...',
                click: () => {
                    togglePreferences();
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
                    ipc.send('download-show');
                },
            },
            {
                type: 'separator',
            },
            {
                label: 'Minimize 👇',
                click: () => {
                    // remote.getCurrentWindow().minimize();
                },
            },
            {
                label: 'Goodbye 😘',
                click: () => {
                    // remote.getCurrentWindow().close();
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
        // contextmenu.popup({
        //     window: remote.getCurrentWindow(),
        // });
    };

    useEvent('contextmenu', handleContextMenu);

    return (
        <HashRouter ref={navigatorRef}>
            <ThemeProvider theme={theme}>{MainRouter}</ThemeProvider>
        </HashRouter>
    );
});

export default App;
