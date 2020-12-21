import { getSongUrl } from 'api/player';
import { ipcRenderer } from 'electron';
import IPlayList from 'interface/IPlayList';
import ISong from 'interface/ISong';
import { makeAutoObservable, runInAction, toJS } from 'mobx';
import lastfm from 'utils/lastfm';
import comments from './comments';
import fm from './fm';
import me from './me';
import preferences from './preferences';
import upnext from './upnext';

const PLAYER_SHUFFLE = 0;
const PLAYER_REPEAT = 1;
const PLAYER_LOOP = 2;
const MODES = [PLAYER_SHUFFLE, PLAYER_REPEAT, PLAYER_LOOP];

class Controller {
    playing = false;

    mode = PLAYER_SHUFFLE;

    // A struct should contains 'id' and 'songs'
    playlist: IPlayList = {};

    // Currently played song
    song: ISong = {};

    // Keep a history with current playlist
    history: number[] = [];

    constructor() {
        makeAutoObservable(this);
    }

    async setup(playlist: any) {
        if (this.playlist.id === playlist.id && playlist.id !== 'PERSONAL_FM') {
            return;
        }

        this.playing = false;
        this.history = [];

        // Disconnect all observer
        this.playlist = JSON.parse(JSON.stringify(playlist));
        const [song] = playlist.songs;
        this.song = song;

        ipcRenderer.send('update-playing', {
            songs: playlist.songs.slice().map((d: any) => toJS(d))
        });
    }

    async play(songId?: number, forward = true) {
        if (!this.playlist || !this.playlist.songs) {
            return;
        }
        const songs = this.playlist.songs.slice();
        let song;

        if (!(upnext.canceled && upnext.canceled.id === songId)) {
            // Keep upnext modal singleton
            upnext.show = false;
        }

        if (songId) {
            song = songs.find(e => e.id === songId);
        }

        song = song || songs[0];

        // Save to history list
        if (!this.history.includes(songId)) {
            this.history[forward ? 'push' : 'unshift'](song.id);
            const songs = this.playlist.songs.filter(e => this.history.includes(e.id)).map(song => toJS(song));
            ipcRenderer.send('update-history', {
                songs
            });
        }

        if (this.playlist.id === 'PERSONAL_FM') {
            fm.song = song;
        }

        if (preferences.showNotification) {
            const notification = new Notification(song.name, {
                icon: song.album.cover,
                body: song.artists.map(e => e.name).join(' / '),
                vibrate: [200, 100, 200]
            });

            notification.onclick = () => {
                ipcRenderer.send('show');
            };
        }

        this.playing = true;
        this.song = song;
        this.updateStatus();
        comments.getList(song);
        await this.resolveSong();
        await lastfm.playing(song);
    }

    resolveSong = async () => {
        const { song } = this;
        try {
            const data = await getSongUrl(song.id, me.profile.cookie);
            runInAction(() => {
                this.song = Object.assign({}, this.song, { data }, { waiting: false });
            });
        } catch (ex) {
            console.error(ex);
        }
    };

    pause = () => {
        this.playing = false;
    };

    prev = async () => {
        const { history, song, playlist } = this;
        let index = history.indexOf(song.id);

        if (--index >= 0) {
            await this.play(history[index], false);
            return;
        }

        if (this.mode === PLAYER_SHUFFLE) {
            const songs = this.playlist.songs.filter(e => history.indexOf(e.id) === -1);
            if (songs.length === 0) {
                await this.play(history[history.length - 1]);
                return;
            }
            index = Math.floor(Math.random() * songs.length);
            const unPlaySong = songs[index];
            await this.play(unPlaySong.id, false);
            return;
        }

        index = playlist.songs.findIndex(e => e.id === song.id);

        if (--index < 0) {
            index = playlist.songs.length - 1;
        }

        await this.play(playlist.songs[index].id, false);
    };

    tryTheNext = async () => {
        const next = await this.next(false, false);
        if (!next) return;
        if (next.id === this.song.id) {
            this.playing = false;
            return;
        }
        upnext.toggle(next);
    };

    next = async (loop = false, autoPlay = true) => {
        let songs = this.playlist.songs.slice();
        const { history, song } = this;
        let index = history.indexOf(song.id);
        let next: number;
        let nextSong;

        switch (true) {
            // In the loop mode, manual shuffle immediate play the next song
            case loop === true && this.mode === PLAYER_LOOP:
                next = this.song.id;
                break;

            case this.playlist.id === 'PERSONAL_FM':
                fm.next();
                return;

            /* Already in history */
            case ++index < history.length:
                next = history[index];
                break;

            case this.mode !== PLAYER_SHUFFLE:
                // Get song from current track list
                index = songs.findIndex(e => e.id === song.id);

                if (++index < songs.length) {
                    nextSong = songs[index];
                } else {
                    [nextSong] = songs;
                }

                next = nextSong.id;
                break;

            default:
                // Random a song from the remaining
                songs = songs.filter(e => !history.includes(e.id));

                if (songs.length) {
                    next = songs[Math.floor(Math.random() * songs.length)].id;
                } else {
                    [next] = history;
                }
        }

        try {
            if (autoPlay) {
                this.play(next);
                return;
            }
        } catch (ex) {
            // Anti-warnning
        }
        return songs.find(e => e.id === next);
    };

    stop = () => {
        const audio = document.querySelector('audio');

        if (audio) {
            audio.pause();
            audio.src = '';
            audio.currentTime = 0;
        }
    };

    toggle = async () => {
        this.playing = !this.playing;

        if (this.playing && upnext.canceled) {
            await this.play(upnext.canceled.id, false);
            upnext.cancel(null);
        }

        this.updateStatus();
    };

    changeMode = (mode?: 0 | 1 | 2) => {
        let index = MODES.indexOf(this.mode);

        if (mode === undefined) {
            if (++index < MODES.length) {
                this.mode = MODES[index];
            } else {
                this.mode = MODES[0];
            }
            return;
        }
        if (MODES.includes(mode)) {
            this.mode = mode;
        } else {
            this.mode = PLAYER_SHUFFLE;
        }

        this.updateStatus();
    };

    scrobble = () => {
        lastfm.scrobble(this.song);
    };

    updateStatus() {
        ipcRenderer.send('update-status', {
            playing: this.playing,
            song: toJS(this.song),
            modes: MODES.map(e => {
                return {
                    mode: e,
                    enabled: e === this.mode
                };
            })
        });
    }
}

export { PLAYER_LOOP, PLAYER_SHUFFLE, PLAYER_REPEAT };
const controller = new Controller();
export default controller;
