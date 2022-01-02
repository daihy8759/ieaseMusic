import { app, BrowserWindow, Menu, shell } from 'electron';
import installer, { REACT_DEVELOPER_TOOLS } from 'electron-devtools-installer';
import isDev from 'electron-is-dev';
import windowStateKeeper from 'electron-window-state';
import { join } from 'path';
import {
    IPC_NAVIGATOR,
    IPC_PLAYER_NEXT,
    IPC_PLAYER_PREV,
    IPC_PLAYER_TOGGLE,
    IPC_PLAYER_VOLUME_DOWN,
    IPC_PLAYER_VOLUME_UP,
    IPC_SONG_LIKE,
} from './../shared/ipc/index';
import setupIPC from './ipc';

const _PLATFORM = process.platform;
const isOsx = _PLATFORM === 'darwin';
// const isLinux = _PLATFORM === 'linux';
const showMenuBarOnLinux = false;
let win: BrowserWindow;
let menu;

const installExtensions = async () => {
    const extensions = [REACT_DEVELOPER_TOOLS.id];
    return Promise.all(extensions.map((name) => installer(name, false)));
};

const mainMenu = [
    {
        label: 'ieaseMusic',
        submenu: [
            {
                label: `About ieaseMusic`,
                selector: 'orderFrontStandardAboutPanel:',
            },
            {
                label: 'Preferences...',
                accelerator: 'Cmd+,',
                click() {
                    win.webContents.send('show-preferences');
                },
            },
            {
                type: 'separator',
            },
            {
                role: 'hide',
            },
            {
                role: 'hideothers',
            },
            {
                role: 'unhide',
            },
            {
                type: 'separator',
            },
            {
                label: 'Check for updates',
                accelerator: 'Cmd+U',
                click() {
                    // updater.checkForUpdates();
                },
            },
            {
                label: 'Quit',
                accelerator: 'Command+Q',
                selector: 'terminate:',
                click() {
                    if (win) {
                        win.close();
                    }
                },
            },
        ],
    },
    {
        label: 'Controls',
        submenu: [
            {
                label: 'Pause',
                accelerator: 'Space',
                click() {
                    win.show();
                    win.webContents.send(IPC_PLAYER_TOGGLE);
                },
            },
            {
                label: 'Next',
                accelerator: 'Right',
                click() {
                    win.show();
                    win.webContents.send(IPC_PLAYER_NEXT);
                },
            },
            {
                label: 'Previous',
                accelerator: 'Left',
                click() {
                    win.show();
                    win.webContents.send(IPC_PLAYER_PREV);
                },
            },
            {
                label: 'Increase Volume',
                accelerator: 'Up',
                click() {
                    win.show();
                    win.webContents.send(IPC_PLAYER_VOLUME_UP);
                },
            },
            {
                label: 'Decrease Volume',
                accelerator: 'Down',
                click() {
                    win.show();
                    win.webContents.send(IPC_PLAYER_VOLUME_DOWN);
                },
            },
            {
                label: 'Like',
                accelerator: 'Cmd+L',
                click() {
                    win.show();
                    win.webContents.send(IPC_SONG_LIKE);
                },
            },
        ],
    },
    {
        label: 'Recently Played',
        submenu: [
            {
                label: 'Nothing...',
            },
        ],
    },
    {
        label: 'Next Up',
        submenu: [
            {
                label: 'Nothing...',
            },
        ],
    },
    {
        label: 'Edit',
        submenu: [
            {
                role: 'undo',
            },
            {
                role: 'redo',
            },
            {
                type: 'separator',
            },
            {
                role: 'cut',
            },
            {
                role: 'copy',
            },
            {
                role: 'paste',
            },
            {
                role: 'pasteandmatchstyle',
            },
            {
                role: 'delete',
            },
            {
                role: 'selectall',
            },
        ],
    },
    {
        label: 'View',
        submenu: [
            {
                label: 'Home',
                accelerator: 'Cmd+Shift+H',
                click() {
                    win.webContents.send(IPC_NAVIGATOR, '/');
                },
            },
            {
                label: 'Search',
                accelerator: 'Cmd+F',
                click() {
                    win.webContents.send('show-search');
                },
            },
            {
                label: 'Top podcasts',
                accelerator: 'Cmd+Shift+T',
                click() {
                    win.webContents.send('show-top');
                },
            },
            {
                label: 'Playlist',
                accelerator: 'Cmd+Shift+P',
                click() {
                    win.webContents.send('show-playlist');
                },
            },
            {
                label: 'Made For You',
                accelerator: 'Cmd+Shift+F',
                click() {
                    win.webContents.send(IPC_NAVIGATOR, '/fm');
                },
            },
            {
                label: 'Downloads',
                accelerator: 'Cmd+Shift+D',
                click() {
                    // downloader.showDownloader();
                },
            },
            {
                type: 'separator',
            },
            {
                label: 'Menu',
                accelerator: 'Cmd+Shift+L',
                click() {
                    win.webContents.send('show-menu');
                },
            },
            {
                label: 'Next Up',
                accelerator: 'Cmd+P',
                click() {
                    win.webContents.send('show-playing');
                },
            },
            {
                type: 'separator',
            },
            {
                role: 'toggledevtools',
            },
        ],
    },
    {
        role: 'window',
        submenu: [
            {
                role: 'minimize',
            },
            {
                role: 'close',
            },
        ],
    },
    {
        role: 'help',
        submenu: [
            {
                label: 'Bug report 🐛',
                click() {
                    shell.openExternal('https://github.com/daihy8759/ieaseMusic/issues');
                },
            },
            {
                label: 'Fork me on Github 🚀',
                click() {
                    shell.openExternal('https://github.com/daihy8759/ieaseMusic');
                },
            },
            {
                type: 'separator',
            },
            {
                label: '💕 Follow me on Twitter 👏',
                click() {
                    shell.openExternal('https://twitter.com/var_darling');
                },
            },
        ],
    },
];

function updateMenu(playing = false) {
    if (!isOsx && !showMenuBarOnLinux) {
        return;
    }
    // @ts-ignore
    mainMenu[1]['submenu'][0]['label'] = playing ? 'Pause' : 'Play';
    // @ts-ignore
    menu = Menu.buildFromTemplate(mainMenu);
    Menu.setApplicationMenu(menu);
}

const createWindow = async () => {
    const mainWindowState = windowStateKeeper({
        defaultWidth: 800,
        defaultHeight: 520,
    });

    win = new BrowserWindow({
        x: mainWindowState.x,
        y: mainWindowState.y,
        show: false,
        minWidth: 800,
        width: 800,
        height: 520,
        minHeight: 520,
        backgroundColor: 'none',
        titleBarStyle: 'hiddenInset',
        webPreferences: {
            preload: join(__dirname, `../../dist/preload/index.preload.js`),
            contextIsolation: true,
        },
    });

    updateMenu();
    mainWindowState.manage(win);
    setupIPC(win);

    if (isDev) {
        win.loadURL(`http://localhost:${process.env.PORT}`);
    } else {
        win.loadURL(`file://${join(__dirname, '../../dist/renderer/index.html')}`);
    }

    win.on('closed', () => {
        win = null;
    });

    win.webContents.on('did-finish-load', () => {
        try {
            win.show();
            win.focus();
        } catch (ex) {}
    });
    // open devTools
    if (isDev) {
        win.webContents.on('did-frame-finish-load', () => {
            win.webContents.once('devtools-opened', () => {
                win.focus();
            });
            win.webContents.openDevTools();
        });
        app.whenReady().then(() => {
            installExtensions();
        });
    }
};

app.whenReady().then(() => createWindow());

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

if (!app.requestSingleInstanceLock()) {
    app.quit();
}
