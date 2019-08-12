import { ipcRenderer, remote, shell } from 'electron';
import { configure } from 'mobx';
import { Provider } from 'mobx-react';
import React from 'react';
import EventListener from 'react-event-listener';
import { hot } from 'react-hot-loader/root';
import { HashRouter } from 'react-router-dom';
import 'remixicon/fonts/remixicon.css';
import { PLAYER_LOOP, PLAYER_REPEAT, PLAYER_SHUFFLE } from 'stores/controller';
import './app.less';
import MainRouter from './routes';
import stores from './stores';

const { Menu } = remote;
configure({ enforceActions: 'observed' });

class App extends React.Component {
    constructor(props) {
        super(props);
        this.navigatorRef = React.createRef();
    }

    // 设置
    togglePreferences = () => {
        const { preferences } = stores;
        preferences.show = !preferences.show;
    };

    toggleLike = () => {
        const { controller, me } = stores;
        const { song } = controller;

        if (me.likes.get(song.id)) {
            me.unlike(song);
            return;
        }
        me.like(song);
    };

    handleContextMenu = () => {
        const { controller, fm, me, menu, playing } = stores;
        const navigator = this.navigatorRef.current;
        const isFMPlaying = () => controller.playlist.id === fm.playlist.id;

        const logined = me.hasLogin();
        // eslint-disable-next-line
        const contextmenu = new Menu.buildFromTemplate([
            {
                label: controller.playing ? 'Pause' : 'Play',
                click: () => {
                    controller.toggle();
                }
            },
            {
                label: 'Next',
                click: () => {
                    if (isFMPlaying()) {
                        fm.next();
                    } else {
                        controller.next();
                    }
                }
            },
            {
                label: 'Previous',
                click: () => {
                    controller.prev();
                }
            },
            {
                type: 'separator'
            },
            {
                label: 'Menu',
                click: () => {
                    menu.toggle(true);
                }
            },
            {
                label: 'Next Up',
                click: () => {
                    playing.toggle(true);
                }
            },
            {
                type: 'separator'
            },
            {
                label: 'Like/Unlike 💖',
                enabled: logined,
                click: () => {
                    this.toggleLike();
                }
            },
            {
                label: 'Ban 💩',
                enabled: logined && controller.playlist.id === 'PERSONAL_FM',
                click: () => {
                    fm.ban(controller.song.id);
                }
            },
            {
                label: 'Download 🍭',
                click: () => {
                    ipcRenderer.send('download', { songs: JSON.stringify(controller.song) });
                }
            },
            {
                type: 'separator'
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
                }
            },
            {
                label: 'Shuffle ⚡️',
                type: 'checkbox',
                checked: controller.mode === PLAYER_SHUFFLE,
                enabled: !isFMPlaying(),
                click: () => {
                    controller.changeMode(PLAYER_SHUFFLE);
                }
            },
            {
                type: 'separator'
            },
            {
                label: 'Preferences...',
                click: () => {
                    this.togglePreferences();
                }
            },
            {
                type: 'separator'
            },
            {
                label: 'Home',
                click: () => {
                    navigator.history.push('/');
                }
            },
            {
                label: 'Search',
                click: () => {
                    navigator.history.push('/search');
                }
            },
            {
                label: 'Playlist',
                click: () => {
                    navigator.history.push('/playlist/全部');
                }
            },
            {
                label: 'Made For You',
                click: () => {
                    navigator.history.push('/fm');
                }
            },
            {
                type: 'separator'
            },
            {
                label: 'Show Comments 💬',
                click: () => {
                    navigator.history.push('/comments');
                }
            },
            {
                label: 'Show Lyrics 🎤',
                click: () => {
                    navigator.history.push('/lyrics');
                }
            },
            {
                label: 'Show Cover 💅',
                click: () => {
                    navigator.history.push('/cover');
                }
            },
            {
                label: 'Show Downloads 🚚',
                click: () => {
                    ipcRenderer.send('download-show');
                }
            },
            {
                type: 'separator'
            },
            {
                label: 'Minimize 👇',
                click: () => {
                    ipcRenderer.send('minimize');
                }
            },
            {
                label: 'Goodbye 😘',
                click: () => {
                    ipcRenderer.send('goodbye');
                }
            },
            {
                type: 'separator'
            },
            {
                label: 'Bug report 🐛',
                click: () => {
                    shell.openExternal('https://github.com/daihy8759/ieaseMusic/issues');
                }
            },
            {
                label: 'Fork me on Github 🚀',
                click: () => {
                    shell.openExternal('https://github.com/daihy8759/ieaseMusic');
                }
            }
        ]);

        contextmenu.popup(remote.getCurrentWindow(), {
            async: true
        });
    };

    render() {
        return (
            <>
                <EventListener target="window" onContextMenu={this.handleContextMenu} />
                <Provider {...stores}>
                    <HashRouter ref={this.navigatorRef}>{MainRouter}</HashRouter>
                </Provider>
            </>
        );
    }
}

export default hot(App);
