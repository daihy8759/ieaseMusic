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
    key: 'volume',
    default: 1,
});
