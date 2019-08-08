import { ipcRenderer } from 'electron';
import { inject } from 'mobx-react';
import React from 'react';
import helper from 'utils/helper';

@inject(stores => ({
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
class AudioPlayer extends React.Component {
    passed = 0;

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

    componentWillReceiveProps(nextProps) {
        const { autoPlay, play, song, playing } = this.props;
        if (nextProps.playing !== playing) {
            try {
                if (
                    !this.player.src &&
                    // Avoid init player duplicate play
                    !autoPlay
                ) {
                    play();
                } else {
                    this.setupPlay(nextProps.playing);
                }
            } catch (ex) {
                // Anti warnning
            }
        }

        if (song.id !== nextProps.song.id) {
            // Re-calculations the buffering progress
            this.bufferedDone = false;
        }
    }

    // 播放，停止
    setupPlay = async playing => {
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

    setPosition(percent, ele = document.all.progress) {
        if (!ele) return;

        ele = ele.firstElementChild;
        ele.style.transform = `translate3d(${-100 + percent * 100}%, 0, 0)`;
    }

    scrollerLyrics(currentTime = 0) {
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
                let playing = ele.querySelectorAll('[playing]');

                Array.from(playing).forEach(e => e.removeAttribute('playing'));

                playing = ele.querySelector(`[data-times='${key}']`);

                if (!playing.getAttribute('playing')) {
                    playing.setAttribute('playing', true);

                    if (ele.querySelector('section').getAttribute('scrolling')) {
                        // Enhancement #317
                        return;
                    }

                    playing.scrollIntoViewIfNeeded();
                }
            }
        }
    }

    progress(currentTime = 0) {
        const {
            song: { duration }
        } = this.props;
        const { ele } = this.progress;

        let newEle = ele;
        if (!ele || document.contains(ele) === false) {
            newEle = document.all.progress;
            this.progress.ele = newEle;
        }

        // Reduce CPU usage, cancel the duplicate compution
        if (currentTime * 1000 - this.passed < 1000) {
            return;
        }

        clearTimeout(this.timer);

        this.timer = setTimeout(() => {
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

    buffering(ele) {
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
                onError={e => {
                    if (!e.target.src.startsWith('http') || song.waiting) return;

                    console.error('Break by %o', e);
                    this.resetProgress();
                    tryTheNext();
                }}
                onSeeked={e => {
                    // Reset passed 0, avoid indicator can not go back
                    this.passed = 0;
                }}
                onTimeUpdate={e => {
                    this.progress(e.target.currentTime);
                    this.scrollerLyrics(e.target.currentTime);
                }}>
                <track src={song.name} kind="captions" />
            </audio>
        );
    }
}

export default AudioPlayer;
