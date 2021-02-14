import { BrowserWindow } from 'electron';
import ipcContextMenu from './contextmenu';
import './music';
import ipcPreference from './preference';
import shortcut from './shortcut';
import './storage';

export default (win: BrowserWindow) => {
    ipcContextMenu(win);
    ipcPreference(win);
    shortcut(win);
};
