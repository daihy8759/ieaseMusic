import type Electron from 'electron';

type ElectronApi = {
    channel: {
        listen: (name: string, func: any) => void;
    };
} & typeof Electron;

const { app, shell, clipboard, ipcRenderer, dialog, channel } = (window as any).electron as ElectronApi;

export function useChannel() {
    return channel;
}

export function useApp() {
    return app;
}

export function useShell() {
    return shell;
}

export function useClipboard() {
    return clipboard;
}

export function useIpc() {
    return ipcRenderer;
}

export function useDialog() {
    return dialog;
}
