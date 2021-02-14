import { ipcMain } from 'electron';
import Store from 'electron-store';
import _debug from 'debug';

const debug = _debug('dev:storage');
const storage = new Store();
debug('store path %s', storage.path);

ipcMain.handle('store:set', (_, ...args) => {
    return storage.set(args[0], args[1]);
});
ipcMain.handle('store:get', (_, ...args) => {
    debug('get store %s', args[0]);
    return storage.get(args[0]);
});
ipcMain.handle('store:delete', (_, ...args) => {
    return storage.delete(args[0]);
});
