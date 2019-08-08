import { ipcMain, globalShortcut } from 'electron';

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

export default win => {
    mainWindow = win;
    registerGlobalShortcut();
    ipcMain.on('goodbye', () => goodbye());
};
