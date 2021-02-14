import musicApi from '@daihy8759/netease-cloud-music-api';
import _debug from 'debug';
import { ipcMain } from 'electron';

const debug = _debug('dev:music:api');
const error = _debug('dev:music:error');

ipcMain.handle('music:call', (_, ...args) => {
    const [methodName, ...rest] = args;
    debug('Handle: %s', methodName);
    debug('Params: %o', ...rest);
    // @ts-ignore
    if (musicApi[methodName]) {
        // @ts-ignore
        return musicApi[methodName](...rest).catch((e) => {
            error('Error: %o', e);
        });
    }
    return new Promise((_, reject) => {
        reject(`method ${methodName} not found`);
    });
});
