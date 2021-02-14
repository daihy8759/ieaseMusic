import throttle from 'lodash.throttle';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { useAudio, useEffectOnce, useUpdateEffect } from 'react-use';
import { IPC_PLAYER_VOLUME_DOWN, IPC_PLAYER_VOLUME_UP } from '../../../shared/ipc';
import { useStore } from '/@/context';
import { useChannel } from '/@/hooks';
import helper from '/@/utils/helper';

const channel = useChannel();

const AudioPlayer = observer(() => {
    const store = useStore();
    const { controller, preferences } = store;
    const { song, tryTheNext, playing, scrobble, next } = controller;
    const [passed, setPassed] = React.useState(0.0);
    let timer: number;

    const [audio, state, controls, ref] = useAudio({
        src: song.data ? song.data.src : '',
        autoPlay: true,
    });
    const throttled = React.useRef(
        throttle((throttledValue) => {
            onProgress(throttledValue);
        }, 1000)
    );
    const throttledLyrics = React.useRef(
        throttle((throttledValue) => {
            onScrollLyrics(throttledValue);
        }, 200)
    );

    useUpdateEffect(() => {
        throttled.current(state.time);
        throttledLyrics.current(state.time);
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
        if (progress && duration) {
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

    const onScrollLyrics = (currentTime = 0) => {
        if (window.location.hash !== '#/lyrics') {
            return false;
        }
        const lyricsEle = document.getElementById('lyrics');
        if (!lyricsEle) {
            return;
        }
        const { list: lyrics } = store.lyrics;
        if (lyricsEle) {
            const key = helper.getLyricsKey(currentTime * 1000, lyrics);
            const currentPlaying = lyricsEle.querySelector(`[playing][data-times='${key}']`);
            // 减少dom更新
            if (currentPlaying) {
                return;
            }
            if (key) {
                const playingEleArray = lyricsEle.querySelectorAll('[playing]');
                const playing = lyricsEle.querySelector(`[data-times='${key}']`);
                Array.from(playingEleArray).forEach((e: HTMLElement) => e.removeAttribute('playing'));
                if (playing && !playing.getAttribute('playing')) {
                    playing.setAttribute('playing', 'true');
                    if (lyricsEle.querySelector('section').getAttribute('scrolling')) {
                        return;
                    }
                    // @ts-ignore
                    playing.scrollIntoViewIfNeeded();
                }
            }
        }
    };

    useEffectOnce(() => {
        const audioRef = ref.current;
        if (audioRef) {
            audioRef.onerror = (e: any) => {
                // TODO: 切换url导致的错误
                if (!audioRef.src.startsWith('http') || song.waiting) {
                    return;
                }

                console.error('Break by %o', e);
                // resetProgress();
                // tryTheNext();
            };

            audioRef.onended = () => {
                scrobble();
                resetProgress();
                next(true);
            };

            audioRef.onseeked = () => {
                setPassed(0.0);
            };
        }
        const { volume, setVolume } = preferences;
        controls.volume(volume);

        channel.listen(IPC_PLAYER_VOLUME_UP, () => {
            const volumeUp = state.volume + 0.1;

            controls.volume(volumeUp > 1 ? 1 : volumeUp);
            setVolume(state.volume);
        });
        channel.listen(IPC_PLAYER_VOLUME_DOWN, () => {
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
