import _debug from 'debug';
import { BrowserWindow, globalShortcut, ipcMain, powerMonitor, session } from 'electron';
import IPreferences from 'src/shared/interface/IPreferences';
import storage from '../shared/storage';

let debug = _debug('dev:main');
let mainWindow: BrowserWindow;

const goodbye = () => {
    if (mainWindow) {
        mainWindow.close();
    }
};

const registerGlobalShortcut = () => {
    // Play the next song
    globalShortcut.register('MediaNextTrack', () => {
        mainWindow.webContents.send('player-next');
    });

    // Play the previous song
    globalShortcut.register('MediaPreviousTrack', () => {
        mainWindow.webContents.send('player-previous');
    });

    // Toggle the player
    globalShortcut.register('MediaPlayPause', () => {
        mainWindow.webContents.send('player-toggle');
    });
};

function setProxyFromStore() {
    // @ts-ignore
    const preferences: IPreferences = storage.get('preferences');
    if (preferences) {
        const { proxy, disableProxy } = preferences;
        if (!disableProxy) {
            setProxy(proxy);
        }
    }
}

function setProxy(proxyRules: string) {
    debug('Apply proxy: %s', proxyRules);
    session.defaultSession.setProxy({
        proxyRules,
        pacScript: '',
        proxyBypassRules: ''
    });
}

export default (win: BrowserWindow) => {
    mainWindow = win;
    setProxyFromStore();
    registerGlobalShortcut();
    // App has suspend
    powerMonitor.on('suspend', () => {
        mainWindow.webContents.send('player-pause');
    });
    ipcMain.on('goodbye', () => goodbye());
    // 设置代理
    ipcMain.on('setProxy', (_event, args) => {
        setProxy(args);
    });
    ipcMain.on('update-preferences', (_event, args = {}) => {
        // 设置代理
        const { disableProxy, proxy, alwaysOnTop } = args;
        if (disableProxy) {
            setProxy('');
        } else {
            setProxy(proxy);
        }
        win.setAlwaysOnTop(!!alwaysOnTop);
    });
};
