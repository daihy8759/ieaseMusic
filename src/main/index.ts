import { app, BrowserWindow, Menu, session, shell } from 'electron';
import installer, { REACT_DEVELOPER_TOOLS } from 'electron-devtools-installer';
import * as windowStateKeeper from 'electron-window-state';
import * as path from 'path';
import * as agent from 'random-useragent';
import * as url from 'url';
import ipcMainSets from './ipcMainSets';

const _PLATFORM = process.platform;
const isOsx = _PLATFORM === 'darwin';
// const isLinux = _PLATFORM === 'linux';
const showMenuBarOnLinux = false;
let win: BrowserWindow;
let menu;

const installExtensions = async () => {
    const extensions = [REACT_DEVELOPER_TOOLS];

    return Promise.all(extensions.map(name => installer(name, false)));
};

const mainMenu = [
    {
        label: 'ieaseMusic',
        submenu: [
            {
                label: `About ieaseMusic`,
                selector: 'orderFrontStandardAboutPanel:'
            },
            {
                label: 'Preferences...',
                accelerator: 'Cmd+,',
                click() {
                    win.webContents.send('show-preferences');
                }
            },
            {
                type: 'separator'
            },
            {
                role: 'hide'
            },
            {
                role: 'hideothers'
            },
            {
                role: 'unhide'
            },
            {
                type: 'separator'
            },
            {
                label: 'Check for updates',
                accelerator: 'Cmd+U',
                click() {
                    // updater.checkForUpdates();
                }
            },
            {
                label: 'Quit',
                accelerator: 'Command+Q',
                selector: 'terminate:',
                click() {
                    // goodbye();
                }
            }
        ]
    },
    {
        label: 'Controls',
        submenu: [
            {
                label: 'Pause',
                accelerator: 'Space',
                click() {
                    win.show();
                    win.webContents.send('player-toggle');
                }
            },
            {
                label: 'Next',
                accelerator: 'Right',
                click() {
                    win.show();
                    win.webContents.send('player-next');
                }
            },
            {
                label: 'Previous',
                accelerator: 'Left',
                click() {
                    win.show();
                    win.webContents.send('player-previous');
                }
            },
            {
                label: 'Increase Volume',
                accelerator: 'Up',
                click() {
                    win.show();
                    win.webContents.send('player-volume-up');
                }
            },
            {
                label: 'Decrease Volume',
                accelerator: 'Down',
                click() {
                    win.show();
                    win.webContents.send('player-volume-down');
                }
            },
            {
                label: 'Like',
                accelerator: 'Cmd+L',
                click() {
                    win.show();
                    win.webContents.send('player-like');
                }
            }
        ]
    },
    {
        label: 'Recently Played',
        submenu: [
            {
                label: 'Nothing...'
            }
        ]
    },
    {
        label: 'Next Up',
        submenu: [
            {
                label: 'Nothing...'
            }
        ]
    },
    {
        label: 'Edit',
        submenu: [
            {
                role: 'undo'
            },
            {
                role: 'redo'
            },
            {
                type: 'separator'
            },
            {
                role: 'cut'
            },
            {
                role: 'copy'
            },
            {
                role: 'paste'
            },
            {
                role: 'pasteandmatchstyle'
            },
            {
                role: 'delete'
            },
            {
                role: 'selectall'
            }
        ]
    },
    {
        label: 'View',
        submenu: [
            {
                label: 'Home',
                accelerator: 'Cmd+Shift+H',
                click() {
                    win.webContents.send('show-home');
                }
            },
            {
                label: 'Search',
                accelerator: 'Cmd+F',
                click() {
                    win.webContents.send('show-search');
                }
            },
            {
                label: 'Top podcasts',
                accelerator: 'Cmd+Shift+T',
                click() {
                    win.webContents.send('show-top');
                }
            },
            {
                label: 'Playlist',
                accelerator: 'Cmd+Shift+P',
                click() {
                    win.webContents.send('show-playlist');
                }
            },
            {
                label: 'Made For You',
                accelerator: 'Cmd+Shift+F',
                click() {
                    win.webContents.send('show-fm');
                }
            },
            {
                label: 'Downloads',
                accelerator: 'Cmd+Shift+D',
                click() {
                    // downloader.showDownloader();
                }
            },
            {
                type: 'separator'
            },
            {
                label: 'Menu',
                accelerator: 'Cmd+Shift+L',
                click() {
                    win.webContents.send('show-menu');
                }
            },
            {
                label: 'Next Up',
                accelerator: 'Cmd+P',
                click() {
                    win.webContents.send('show-playing');
                }
            },
            {
                type: 'separator'
            },
            {
                role: 'toggledevtools'
            }
        ]
    },
    {
        role: 'window',
        submenu: [
            {
                role: 'minimize'
            },
            {
                role: 'close'
            }
        ]
    },
    {
        role: 'help',
        submenu: [
            {
                label: 'Bug report 🐛',
                click() {
                    shell.openExternal('https://github.com/trazyn/ieaseMusic/issues');
                }
            },
            {
                label: 'Fork me on Github 🚀',
                click() {
                    shell.openExternal('https://github.com/trazyn/ieaseMusic');
                }
            },
            {
                type: 'separator'
            },
            {
                label: '💕 Follow me on Twitter 👏',
                click() {
                    shell.openExternal('https://twitter.com/var_darling');
                }
            }
        ]
    }
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
    await app.whenReady();
    const mainWindowState = windowStateKeeper({
        defaultWidth: 800,
        defaultHeight: 520
    });

    win = new BrowserWindow({
        x: mainWindowState.x,
        y: mainWindowState.y,
        show: false,
        width: 800,
        height: 520,
        backgroundColor: 'none',
        titleBarStyle: 'hiddenInset',
        webPreferences: {
            webSecurity: false,
            nodeIntegration: true,
            enableRemoteModule: true
        }
    });

    updateMenu();
    mainWindowState.manage(win);
    ipcMainSets(win);

    if (process.env.NODE_ENV !== 'production') {
        win.loadURL('http://localhost:2003');
    } else {
        win.loadURL(
            url.format({
                pathname: path.join(__dirname, 'index.html'),
                protocol: 'file:',
                slashes: true
            })
        );
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
    // cors
    const ieaseUri = 'https://music.163.com';
    win.webContents.session.webRequest.onBeforeSendHeaders(
        {
            urls: [`${ieaseUri}/*`]
        },
        async (details, callback) => {
            const cookie = await session.defaultSession.cookies.get({ url: ieaseUri });
            callback({
                requestHeaders: {
                    ...details.requestHeaders,
                    Connection: 'keep-alive',
                    Referer: ieaseUri,
                    cookie,
                    Origin: ieaseUri,
                    Host: 'music.163.com',
                    'User-Agent': agent.getRandom()
                }
            });
        }
    );
    // open devTools
    if (process.env.NODE_ENV !== 'production') {
        win.webContents.on('did-frame-finish-load', () => {
            win.webContents.once('devtools-opened', () => {
                win.focus();
            });
            win.webContents.openDevTools();
        });
        await installExtensions();
    }
};

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    app.quit();
});

app.on('activate', () => {
    if (win === null) {
        createWindow();
    }
});
