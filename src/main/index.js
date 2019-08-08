import { app, BrowserWindow } from 'electron';
import installer, { MOBX_DEVTOOLS, REACT_DEVELOPER_TOOLS } from 'electron-devtools-installer';
import windowStateKeeper from 'electron-window-state';
import path from 'path';
import agent from 'random-useragent';
import url from 'url';
import ipcMainSets from './ipcMainSets';

process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = true;

let win;

const installExtensions = async () => {
    const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
    const extensions = [REACT_DEVELOPER_TOOLS, MOBX_DEVTOOLS];

    return Promise.all(extensions.map(name => installer(name, forceDownload)));
};

const createWindow = async () => {
    if (process.env.NODE_ENV !== 'production') {
        await installExtensions();
    }

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
        resizable: false,
        maximizable: false,
        fullscreenable: false,
        backgroundColor: 'none',
        titleBarStyle: 'hiddenInset',
        webPreferences: {
            webSecurity: false,
            nodeIntegration: true
        }
    });

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
    win.webContents.session.webRequest.onBeforeSendHeaders(
        {
            urls: ['http://music.163.com/*']
        },
        (details, callback) => {
            callback({
                requestHeaders: {
                    ...details.requestHeaders,
                    Connection: 'keep-alive',
                    Referer: 'http://music.163.com',
                    Origin: 'http://music.163.com',
                    Host: 'music.163.com',
                    'User-Agent': agent.getRandom()
                }
            });
        }
    );
    // open devTools
    win.webContents.once('dom-ready', () => {
        if (process.env.NODE_ENV !== 'production') {
            win.webContents.openDevTools();
        }
    });
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
