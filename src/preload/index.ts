import { clipboard, contextBridge, Dialog, ipcRenderer, shell } from 'electron';
import io from './io';
import music from './music';
import storage from './storage';

console.log('preload!');

const electronApi = {
    shell,
    clipboard,
    ipcRenderer,
    app: {
        getAppPath() {
            return ipcRenderer.sendSync('app:getAppPath');
        },
        getPath(name: 'userData') {
            return ipcRenderer.sendSync('app:getPath', name);
        },
    },
    channel: {
        listen(channel: string, func: any) {
            // TODO: check channel
            if (func) {
                ipcRenderer.on(channel, (event, ...args) => func(...args));
            }
        },
        // TODO
        removeListener(channel: string, func: any) {
            ipcRenderer.removeListener(channel, func);
        },
    },
    dialog: {
        showCertificateTrustDialog(...options: any[]) {
            return ipcRenderer.invoke('dialog:showCertificateTrustDialog', ...options);
        },
        showErrorBox(...options: any[]) {
            return ipcRenderer.invoke('dialog:showErrorBox', ...options);
        },
        showMessageBox(...options: any[]) {
            return ipcRenderer.invoke('dialog:showMessageBox', ...options);
        },
        showOpenDialog(...options: any[]) {
            return ipcRenderer.invoke('dialog:showOpenDialog', ...options);
        },
        showSaveDialog(...options: any[]) {
            return ipcRenderer.invoke('dialog:showSaveDialog', ...options);
        },
    } as Pick<
        Dialog,
        'showCertificateTrustDialog' | 'showErrorBox' | 'showMessageBox' | 'showOpenDialog' | 'showSaveDialog'
    >,
};

function tryExpose(exposeName: string, mod: any) {
    try {
        contextBridge.exposeInMainWorld(exposeName, mod);
    } catch {
        (window as any)[exposeName] = mod;
    }
}

tryExpose('electron', electronApi);
tryExpose('io', io);
tryExpose('musicApi', music);
tryExpose('storage', storage);
