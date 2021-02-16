import { ipcRenderer } from 'electron';

export default {
    set(key: string, value: any) {
        return ipcRenderer.invoke('store:set', key, value);
    },
    async get(key: string) {
        const result = await ipcRenderer.invoke('store:get', key);
        return result;
    },
    delete(key: string) {
        return ipcRenderer.invoke('store:delete', key);
    },
};
