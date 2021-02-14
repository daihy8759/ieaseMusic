import { BrowserWindow, globalShortcut } from 'electron';

export default function (win: BrowserWindow) {
    globalShortcut.register('MediaNextTrack', () => {
        win.webContents.send('player-next');
    });

    // Play the previous song
    globalShortcut.register('MediaPreviousTrack', () => {
        win.webContents.send('player-previous');
    });

    // Toggle the player
    globalShortcut.register('MediaPlayPause', () => {
        win.webContents.send('player-toggle');
    });
}
