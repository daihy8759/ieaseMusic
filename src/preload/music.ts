import { ipcRenderer } from 'electron';

const musicApi = {
    callApi(name: string, args: any) {
        return ipcRenderer.invoke('music:call', name, ...args);
    },
};

export default musicApi;
