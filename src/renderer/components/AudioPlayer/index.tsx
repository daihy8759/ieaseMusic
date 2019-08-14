import { ipcRenderer } from 'electron';
import ISong from 'interface/ISong';
import IStore from 'interface/IStore';
import { inject } from 'mobx-react';
import * as React from 'react';
import helper from 'utils/helper';

interface IAudioPlayerProps {
    song?: ISong;
    volume?: number;
    setVolume?: any;
    playing?: boolean;
    tryTheNext?: any;
    scrobble?: any;
    next?: any;
    autoPlay?: any;
    play?: any;
    lyrics?: any;
    scrollerLyrics?: any;
}

@inject((stores: IStore) => ({
    song: stores.controller.song,
    scrobble: stores.controller.scrobble,
    next: stores.controller.next,
    play: () => stores.controller.play(stores.controller.song.id),
    tryTheNext: stores.controller.tryTheNext,
    playing: stores.controller.playing,
    volume: stores.preferences.volume,
    setVolume: stores.preferences.setVolume,
    autoPlay: stores.preferences.autoPlay,
    lyrics: stores.lyrics.list
}))
class AudioPlayer extends React.Component<IAudioPlayerProps, {}> {
    passed = 0;
    timer: number;
    bufferedDone: boolean;
    player: HTMLAudioElement;
    progress: any = {
        ele: null
    };
    scrollerLyrics: any = {
        ele: null
    };

    componentDidMount() {
        const { player } = this;
        const { volume, setVolume } = this.props;

        ipcRenderer.on('player-volume-up', () => {
            const volumeUp = player.volume + 0.1;

            player.volume = volumeUp > 1 ? 1 : volumeUp;
            setVolume(player.volume);
        });

        ipcRenderer.on('player-volume-down', () => {
            const volumeDown = player.volume - 0.1;

            player.volume = volumeDown < 0 ? 0 : volumeDown;
            setVolume(player.volume);
        });
        player.volume = volume;
    }

    componentDidUpdate(prevProps: IAudioPlayerProps) {
        const { autoPlay, play, song, playing } = this.props;
        if (prevProps.playing !== playing) {
            if (!this.player.src && !autoPlay) {
                play();
            } else {
                this.setupPlay(playing);
            }
        }
        if (song.id !== prevProps.song.id) {
            this.bufferedDone = false;
        }
    }

    // 播放，停止
    setupPlay = async (playing: boolean) => {
        if (playing) {
            try {
                await this.player.play();
            } catch (e) {
                // play failed
            }
            this.player.muted = false;
        } else {
            this.player.pause();
        }
    };

    setPosition(percent: number, ele = document.all.item('progress')) {
        if (!ele) return;

        // @ts-ignore
        ele = ele.firstElementChild;
        // @ts-ignore
        ele.style.transform = `translate3d(${-100 + percent * 100}%, 0, 0)`;
    }

    onScrollerLyrics(currentTime = 0) {
        const { lyrics } = this.props;
        const { ele } = this.scrollerLyrics;

        if (window.location.hash !== '#/lyrics') {
            return;
        }

        let newEle = ele;
        if (!ele || document.contains(ele) === false) {
            newEle = document.getElementById('lyrics');
            this.scrollerLyrics.ele = newEle;
        }

        if (newEle) {
            const key = helper.getLyricsKey(currentTime * 1000, lyrics);

            if (key) {
                let playing = newEle.querySelectorAll('[playing]');

                Array.from(playing).forEach((e: HTMLElement) => e.removeAttribute('playing'));

                playing = newEle.querySelector(`[data-times='${key}']`);

                if (!playing.getAttribute('playing')) {
                    playing.setAttribute('playing', true);

                    if (newEle.querySelector('section').getAttribute('scrolling')) {
                        // Enhancement #317
                        return;
                    }

                    playing.scrollIntoViewIfNeeded();
                }
            }
        }
    }

    onProgress(currentTime = 0) {
        const {
            song: { duration }
        } = this.props;
        const { ele } = this.progress;

        let newEle = ele;
        if (!ele || document.contains(ele) === false) {
            newEle = document.all.item('progress');
            this.progress.ele = newEle;
        }

        // Reduce CPU usage, cancel the duplicate compution
        if (currentTime * 1000 - this.passed < 1000) {
            return;
        }

        clearTimeout(this.timer);

        this.timer = window.setTimeout(() => {
            // Some screens progress bar not visible
            if (newEle) {
                const percent = (currentTime * 1000) / duration;

                this.setPosition(percent, newEle);
                this.buffering(newEle.lastElementChild);

                newEle.firstElementChild.setAttribute(
                    'data-time',
                    `${helper.getTime(currentTime * 1000)} / ${helper.getTime(duration)}`
                );
            }
        }, 450);

        this.passed = currentTime * 1000;
    }

    buffering(ele: any) {
        const { player } = this;

        if (
            !this.bufferedDone &&
            ele &&
            // Player has started
            player.buffered.length
        ) {
            let buffered = player.buffered.end(player.buffered.length - 1);

            if (buffered >= 100) {
                buffered = 100;
                // Minimum reLayout
                this.bufferedDone = true;
            }
            ele.style.transform = `translate3d(${-100 + buffered}%, 0, 0)`;
        }
    }

    resetProgress() {
        clearTimeout(this.timer);
        this.passed = 0;
        this.setPosition(0);
    }

    render() {
        const { song, tryTheNext, scrobble, next } = this.props;

        return (
            <audio
                ref={ele => {
                    this.player = ele;
                }}
                style={{
                    display: 'none'
                }}
                src={song.data ? song.data.src : null}
                autoPlay
                muted
                onAbort={e => {
                    this.resetProgress();
                }}
                onEnded={e => {
                    scrobble();
                    this.resetProgress();
                    next(true);
                }}
                onError={(e: any) => {
                    if (!e.target.src.startsWith('http') || song.waiting) return;

                    console.error('Break by %o', e);
                    this.resetProgress();
                    tryTheNext();
                }}
                onSeeked={e => {
                    // Reset passed 0, avoid indicator can not go back
                    this.passed = 0;
                }}
                onTimeUpdate={(e: any) => {
                    this.onProgress(e.target.currentTime);
                    this.onScrollerLyrics(e.target.currentTime);
                }}>
                <track src={song.name} kind="captions" />
            </audio>
        );
    }
}

export default AudioPlayer;
