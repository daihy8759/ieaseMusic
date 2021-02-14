import { BrowserWindow, ipcMain, Menu, shell } from 'electron';
import { PlayMode } from '../../shared/interface/controller';
import {
    IPC_CONTEXTMENU,
    IPC_NAVIGATOR,
    IPC_PLAYER_CHANGE_MODE,
    IPC_PLAYER_NEXT,
    IPC_PLAYER_PREV,
    IPC_PLAYER_TOGGLE,
    IPC_PREFERENCE,
    IPC_SONG_BAN,
    IPC_SONG_LIKE,
} from '../../shared/ipc';

interface ContextmenuConfig {
    playing: boolean;
    isLogin: boolean;
    playlistId: string;
    playMode: PlayMode;
    fmPlaying: boolean;
}

export default function (win: BrowserWindow) {
    ipcMain.handle(IPC_CONTEXTMENU, (_, ...args) => {
        const config: ContextmenuConfig = args[0] || {
            playing: false,
        };
        const contextmenu = Menu.buildFromTemplate([
            {
                label: config.playing ? 'Pause' : 'Play',
                click: () => {
                    win.webContents.send(IPC_PLAYER_TOGGLE);
                },
            },
            {
                label: 'Next',
                click: () => {
                    win.webContents.send(IPC_PLAYER_NEXT);
                },
            },
            {
                label: 'Previous',
                click: () => {
                    win.webContents.send(IPC_PLAYER_PREV);
                },
            },
            {
                type: 'separator',
            },
            {
                label: 'Like/Unlike 💖',
                enabled: config.isLogin,
                click: () => {
                    win.webContents.send(IPC_SONG_LIKE);
                },
            },
            {
                label: 'Ban 💩',
                enabled: config.isLogin && config.playlistId === 'PERSONAL_FM',
                click: () => {
                    win.webContents.send(IPC_SONG_BAN);
                },
            },
            {
                label: 'Download 🍭',
                click: () => {
                    // TODO download
                },
            },
            {
                type: 'separator',
            },
            {
                label: 'Repeat 🤘',
                type: 'checkbox',
                checked: config.playMode === PlayMode.PLAYER_LOOP,
                click: () => {
                    if (config.playMode === PlayMode.PLAYER_LOOP) {
                        win.webContents.send(IPC_PLAYER_CHANGE_MODE, PlayMode.PLAYER_REPEAT);
                    } else {
                        win.webContents.send(IPC_PLAYER_CHANGE_MODE, PlayMode.PLAYER_LOOP);
                    }
                },
            },
            {
                label: 'Shuffle ⚡️',
                type: 'checkbox',
                checked: config.playMode === PlayMode.PLAYER_SHUFFLE,
                enabled: !config.fmPlaying,
                click: () => {
                    win.webContents.send(IPC_PLAYER_CHANGE_MODE, PlayMode.PLAYER_SHUFFLE);
                },
            },
            {
                type: 'separator',
            },
            {
                label: 'Preferences...',
                click: () => {
                    win.webContents.send(IPC_PREFERENCE);
                },
            },
            {
                type: 'separator',
            },
            {
                label: 'Home',
                click: () => {
                    win.webContents.send(IPC_NAVIGATOR, '/');
                },
            },
            {
                label: 'Search',
                click: () => {
                    win.webContents.send(IPC_NAVIGATOR, '/search');
                },
            },
            {
                label: 'Playlist',
                click: () => {
                    win.webContents.send(IPC_NAVIGATOR, '/playlist/全部');
                },
            },
            {
                label: 'Made For You',
                click: () => {
                    win.webContents.send(IPC_NAVIGATOR, '/fm');
                },
            },
            {
                type: 'separator',
            },
            {
                label: 'Show Comments 💬',
                click: () => {
                    win.webContents.send(IPC_NAVIGATOR, '/comments');
                },
            },
            {
                label: 'Show Lyrics 🎤',
                click: () => {
                    win.webContents.send(IPC_NAVIGATOR, '/lyrics');
                },
            },
            {
                label: 'Show Cover 💅',
                click: () => {
                    win.webContents.send(IPC_NAVIGATOR, '/cover');
                },
            },
            {
                label: 'Show Downloads 🚚',
                click: () => {
                    // TODO: create download
                },
            },
            {
                type: 'separator',
            },
            {
                label: 'Minimize 👇',
                click: () => {
                    win.minimize();
                },
            },
            {
                label: 'Goodbye 😘',
                click: () => {
                    win.close();
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
            window: win,
        });
    });
}
