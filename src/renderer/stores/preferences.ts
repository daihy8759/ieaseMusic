import { atom, useRecoilState } from 'recoil';

const namespace = 'preferences';

export const autoPlayState = atom({
    key: `${namespace}:autoPlay`,
    default: false,
});

export const preferencesShowState = atom({
    key: `${namespace}:show`,
    default: false,
});

export function useTogglePreference() {
    const [show, setShow] = useRecoilState(preferencesShowState);

    const setShowAsync = () => {
        setShow(!show);
    };

    return setShowAsync;
}

export const volumeState = atom({
    key: `${namespace}:volume`,
    default: 1,
});

export const connectingState = atom({
    key: `${namespace}:connecting`,
    default: false,
});

export const alwaysOnTopState = atom({
    key: `${namespace}:alwaysOnTop`,
    default: false,
});

export const showTrayState = atom({
    key: `${namespace}:showTray`,
    default: false,
});

export const showNotificationState = atom({
    key: `${namespace}:showNotification`,
    default: false,
});

export const proxyState = atom({
    key: `${namespace}:proxy`,
    default: '',
});

export const proxyEnableState = atom({
    key: `${namespace}:proxyEnable`,
    default: false,
});

export const revertTrayIconState = atom({
    key: `${namespace}:revertTrayIcon`,
    default: false,
});

export const lastFmState = atom({
    key: `${namespace}:lastFm`,
    default: {
        username: '',
        password: '',
        connected: '',
    },
});
