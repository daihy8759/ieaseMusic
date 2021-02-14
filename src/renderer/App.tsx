import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import { configure } from 'mobx';
import { observer } from 'mobx-react-lite';
import React, { useRef } from 'react';
import { HashRouter } from 'react-router-dom';
import { useEffectOnce, useEvent } from 'react-use';
import {
    IPC_CONTEXTMENU,
    IPC_NAVIGATOR,
    IPC_PLAYER_NEXT,
    IPC_PLAYER_PAUSE,
    IPC_PLAYER_TOGGLE,
    IPC_PREFERENCE,
    IPC_SONG_LIKE,
} from '../shared/ipc';
import './App.less';
import { useStore } from './context';
import { useChannel, useIpc } from './hooks';
import MainRouter from './routes';

configure({ enforceActions: 'observed' });

const theme = createMuiTheme({
    palette: {},
});
const ipc = useIpc();
const channel = useChannel();

const App = observer(() => {
    const navigatorRef = useRef<any>();
    const store = useStore();
    const { controller, playing, fm } = store;

    useEffectOnce(() => {
        const navigator = navigatorRef.current;
        channel.listen(IPC_NAVIGATOR, (...args: any) => {
            if (args[0]) {
                navigator.history.push(args[0]);
            }
        });
        channel.listen(IPC_PLAYER_TOGGLE, () => {
            if (navigator.history.location.pathname === '/search' || playing.show) {
                return;
            }
            controller.toggle();
        });
        channel.listen(IPC_PLAYER_PAUSE, () => {
            if (controller.playing) {
                controller.toggle();
            }
        });
        channel.listen(IPC_PLAYER_NEXT, () => {
            const FMPlaying = isFMPlaying();
            if (FMPlaying) {
                fm.next();
            } else {
                controller.next();
            }
        });
        channel.listen(IPC_SONG_LIKE, toggleLike);
        channel.listen(IPC_PREFERENCE, togglePreferences);
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
        const { controller, fm, me } = store;
        const isFMPlaying = () => controller.playlist.id === fm.playlist.id;

        ipc.invoke(IPC_CONTEXTMENU, {
            playing: controller.playing,
            isLogin: me.hasLogin(),
            playlistId: controller.playlist.id,
            playMode: controller.mode,
            fmPlaying: isFMPlaying(),
        });
    };

    useEvent('contextmenu', handleContextMenu);

    return (
        <HashRouter ref={navigatorRef}>
            <ThemeProvider theme={theme}>{MainRouter}</ThemeProvider>
        </HashRouter>
    );
});

export default App;
