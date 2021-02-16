import throttle from 'lodash.throttle';
import React, { useCallback, useState } from 'react';
import { useAudio, useEffectOnce, useUpdateEffect } from 'react-use';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { IPC_PLAYER_VOLUME_DOWN, IPC_PLAYER_VOLUME_UP } from '../../../shared/ipc';
import { useChannel } from '/@/hooks';
import { bufferTimeState } from '/@/stores/audio';
import { playingState, songDetailState, useToggleNext } from '/@/stores/controller';
import { volumeState } from '/@/stores/preferences';
import helper from '/@/utils/helper';

const channel = useChannel();

const AudioPlayer = () => {
    const [passed, setPassed] = useState(0.0);
    let timer: number;
    const song = useRecoilValue(songDetailState);
    const setBufferTime = useSetRecoilState(bufferTimeState);
    const { duration } = song;
    const playing = useRecoilValue(playingState);
    const [volume, setVolume] = useRecoilState(volumeState);
    const toggleNext = useToggleNext();

    const throttleProcess = useCallback(
        throttle((time, duration) => {
            setBufferTime(time);
            onProgress(time, duration);
        }, 1000),
        []
    );

    const [audio, state, controls, ref] = useAudio({
        src: song.data ? song.data.src : '',
        autoPlay: true,
    });

    useUpdateEffect(() => {
        if (duration) {
            throttleProcess(state.time, duration);
        }
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

    const onProgress = (currentTime = 0, duration: number) => {
        const progress = document.getElementById('progress');
        if (progress) {
            const passedTime = currentTime * 1000;
            if (passedTime - passed < 1000) {
                return;
            }
            const percent = passedTime / duration;
            setPosition(percent, progress);
            progress.firstElementChild?.setAttribute(
                'data-time',
                `${helper.getTime(passedTime)} / ${helper.getTime(duration)}`
            );
            setPassed(passedTime);
        }
    };

    // ⚠️在audioRef.onended直接调用会导致获取状态有问题
    const toggleNextWrapper = () => {
        resetProgress();
        toggleNext();
    };

    useEffectOnce(() => {
        const audioRef = ref.current;
        if (audioRef) {
            audioRef.onerror = (e: any) => {
                if (!audioRef.src.startsWith('http') || !song.id || song.waiting) {
                    return;
                }
                console.error('Break by %o', e);
                resetProgress();
                // tryTheNext();
            };

            audioRef.onended = () => {
                toggleNextWrapper();
            };

            audioRef.onseeked = () => {
                setPassed(0.0);
            };
        }
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
        setupPlay(playing);
    }, [playing]);

    return <>{audio}</>;
};

export default AudioPlayer;
