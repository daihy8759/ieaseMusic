import { ipcRenderer } from 'electron';

export default {
    set(key: string, value: any) {
        return ipcRenderer.invoke('store:set', key, value);
    },
    get(key: string) {
        return ipcRenderer.invoke('store:get', key);
    },
    delete(key: string) {
        return ipcRenderer.invoke('store:delete', key);
    },
};
