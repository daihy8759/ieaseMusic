import { throttle } from 'lodash-es';
import React, { useCallback, useEffect } from 'react';
import { useAudio, useEffectOnce, useUpdateEffect } from 'react-use';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { IPC_PLAYER_VOLUME_DOWN, IPC_PLAYER_VOLUME_UP } from '../../../shared/ipc';
import { useChannel } from '/@/hooks';
import { bufferTimeState } from '/@/stores/audio';
import { playingState, songDetailState, useToggleNext } from '/@/stores/controller';
import { volumeState } from '/@/stores/preferences';

const channel = useChannel();

const AudioPlayer = () => {
    const toggleNext = useToggleNext();
    const song = useRecoilValue(songDetailState) || {};
    const setBufferTime = useSetRecoilState(bufferTimeState);
    const playing = useRecoilValue(playingState);
    const [volume, setVolume] = useRecoilState(volumeState);

    const throttleProcess = useCallback(
        throttle((time) => {
            setBufferTime(time);
        }, 1000),
        []
    );

    const [audio, state, controls, ref] = useAudio({
        src: song.data ? song.data.src : '',
        autoPlay: true,
    });

    useEffect(() => {
        if (song && song.duration) {
            throttleProcess(state.time);
        }
    }, [state.time]);

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

    useEffectOnce(() => {
        const audioRef = ref.current;
        if (audioRef) {
            audioRef.onerror = (e: any) => {
                if (!audioRef.src.startsWith('http') || !song.id || song.waiting) {
                    return;
                }
                console.error('Break by %o', e);
                // tryTheNext();
            };

            audioRef.onended = () => {
                toggleNext();
            };

            audioRef.onseeked = () => {
                // setPassed(0.0);
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
