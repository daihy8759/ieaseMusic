import _debug from 'debug';
import { BrowserWindow, ipcMain, powerMonitor, session } from 'electron';
import IPreferences from '../../shared/interface/IPreferences';

const debug = _debug('dev:preference');
let mainWindow: BrowserWindow;

function setProxy(proxyRules: string) {
    debug('Apply proxy: %s', proxyRules);
    session.defaultSession.setProxy({
        proxyRules,
        pacScript: '',
        proxyBypassRules: '',
    });
}

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

export default (win: BrowserWindow) => {
    mainWindow = win;
    // setProxyFromStore();
    // App has suspend
    powerMonitor.on('suspend', () => {
        mainWindow.webContents.send('player-pause');
    });
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
