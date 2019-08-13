import { ipcMain, session, globalShortcut } from 'electron';
import storage from './utils/storage';

let mainWindow;

const goodbye = () => {
    if (mainWindow) {
        mainWindow.close();
    }
};

const registerGlobalShortcut = () => {
    // Play the next song
    globalShortcut.register('MediaNextTrack', e => {
        mainWindow.webContents.send('player-next');
    });

    // Play the previous song
    globalShortcut.register('MediaPreviousTrack', e => {
        mainWindow.webContents.send('player-previous');
    });

    // Toggle the player
    globalShortcut.register('MediaPlayPause', e => {
        mainWindow.webContents.send('player-toggle');
    });
};

async function setProxyFromStore() {
    const preferences = await storage.get('preferences');
    const { proxy } = preferences;
    setProxy(proxy);
}

function setProxy(proxyRules) {
    console.log('setProxy', proxyRules);
    session.defaultSession.setProxy({ proxyRules });
}

export default win => {
    mainWindow = win;
    setProxyFromStore();
    registerGlobalShortcut();
    ipcMain.on('goodbye', () => goodbye());
    // 设置代理
    ipcMain.on('setProxy', (_event, args) => {
        setProxy(args);
    });
};
