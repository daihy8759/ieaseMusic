import { useStore } from '@/context';
import { ipcRenderer } from 'electron';
import throttle from 'lodash/throttle';
import { observer } from 'mobx-react-lite';
import * as React from 'react';
import { useAudio, useEffectOnce, useUpdateEffect } from 'react-use';
import helper from 'utils/helper';

const AudioPlayer: React.FC = observer(() => {
    const store = useStore();
    const { controller, preferences } = store;
    const { song, tryTheNext, playing, scrobble, next } = controller;
    const [passed, setPassed] = React.useState(0.0);
    let timer: number;

    const [audio, state, controls, ref] = useAudio({
        src: song.data ? song.data.src : null,
        autoPlay: true
    });
    const throttled = React.useRef(
        throttle(throttledValue => {
            onProgress(throttledValue);
            onScrollerLyrics(throttledValue);
        }, 1000)
    );

    useUpdateEffect(() => {
        throttled.current(state.time);
    }, [state.time]);

    // buffered
    useUpdateEffect(() => {
        const [buffered] = state.buffered;
        if (buffered) {
            let bufferedTransform = buffered.end;
            if (bufferedTransform >= 100) {
                bufferedTransform = 100;
            }
            const progress = document.getElementById('progress');
            if (progress) {
                // @ts-ignore
                progress.lastElementChild.style.transform = `translate3d(${-100 + bufferedTransform}%, 0, 0)`;
            }
        }
    }, [state.buffered]);

    const resetProgress = () => {
        clearTimeout(timer);
        setPassed(0.0);
        setPosition(0);
    };

    const setPosition = (percent: number, ele = document.getElementById('progress')) => {
        if (!ele) return;
        const firstElementChild = ele.firstElementChild;
        if (firstElementChild) {
            // @ts-ignore
            firstElementChild.style.transform = `translate3d(${-100 + percent * 100}%, 0, 0)`;
        }
    };

    // 播放，停止
    const setupPlay = async (playing: boolean) => {
        if (playing) {
            try {
                await controls.play();
                controls.unmute();
            } catch (e) {
                // play failed
            }
        } else {
            controls.pause();
        }
    };

    const onProgress = (currentTime = 0) => {
        const { duration } = store.controller.song;
        const progress = document.getElementById('progress');
        if (progress) {
            const passedTime = currentTime * 1000;
            if (passedTime - passed < 1000) {
                return;
            }
            const percent = passedTime / duration;
            setPosition(percent, progress);
            progress.firstElementChild.setAttribute(
                'data-time',
                `${helper.getTime(passedTime)} / ${helper.getTime(duration)}`
            );
            setPassed(passedTime);
        }
    };

    const onScrollerLyrics = (currentTime = 0) => {
        const lyricsEle = document.getElementById('lyrics');
        if (!lyricsEle) {
            return;
        }
        const { list: lyrics } = store.lyrics;
        const newEle = lyricsEle.firstElementChild;
        if (newEle) {
            const key = helper.getLyricsKey(currentTime * 1000, lyrics);

            if (key) {
                const playingEleArray = newEle.querySelectorAll('[playing]');
                Array.from(playingEleArray).forEach((e: HTMLElement) => e.removeAttribute('playing'));
                const playing = newEle.querySelector(`[data-times='${key}']`);
                if (!playing.getAttribute('playing')) {
                    playing.setAttribute('playing', 'true');
                    if (newEle.querySelector('section').getAttribute('scrolling')) {
                        return;
                    }
                    // @ts-ignore
                    playing.scrollIntoViewIfNeeded();
                }
            }
        }
    };

    useEffectOnce(() => {
        ref.current.onerror = (e: any) => {
            if (!ref.current.src.startsWith('http') || song.waiting) return;

            console.error('Break by %o', e);
            resetProgress();
            tryTheNext();
        };

        ref.current.onended = () => {
            scrobble();
            resetProgress();
            next(true);
        };

        ref.current.onseeked = () => {
            setPassed(0.0);
        };
        const { volume, setVolume } = preferences;
        controls.volume(volume);

        ipcRenderer.on('player-volume-up', () => {
            const volumeUp = state.volume + 0.1;

            controls.volume(volumeUp > 1 ? 1 : volumeUp);
            setVolume(state.volume);
        });
        ipcRenderer.on('player-volume-down', () => {
            const volumeDown = state.volume - 0.1;
            controls.volume(volumeDown < 0 ? 0 : volumeDown);
            setVolume(state.volume);
        });
    });

    useUpdateEffect(() => {
        const { autoPlay } = preferences;
        if (!ref.current.src && !autoPlay) {
            controller.play(song.id);
        } else {
            setupPlay(playing);
        }
    }, [playing]);

    return <>{audio}</>;
});

export default AudioPlayer;
