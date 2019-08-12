import { ipcRenderer, remote } from 'electron';
import { action, observable, runInAction } from 'mobx';
import path from 'path';
import pkg from 'root/package.json';
import lastfm from 'utils/lastfm';
import storage from 'utils/storage';
import theme from '../theme';
import controller from './controller';

class Preferences {
    @observable show = false;

    @observable showTray = false;

    @observable showMenuBarOnLinux = false;

    @observable revertTrayIcon = false;

    @observable alwaysOnTop = false;

    @observable showNotification = false;

    @observable autoPlay = true;

    @observable volume = 1;

    @observable highquality = 0;

    @observable autoupdate = false;

    @observable lastFm = {
        username: '', // Your last.fm username
        password: '' // Your last.fm password
    };

    @observable connecting = false;

    @observable scrobble = true;

    @observable enginers = {
        QQ: true,
        MiGu: true,
        Xiami: false,
        Kugou: false,
        Baidu: true,
        kuwo: true
    };

    @observable proxy = '';

    @observable downloads = path.join(remote.app.getPath('music'), pkg.name);

    @action
    async init() {
        const preferences = await storage.get('preferences');
        const {
            showTray = this.showTray,
            showMenuBarOnLinux = this.showMenuBarOnLinux,
            revertTrayIcon = this.revertTrayIcon,
            alwaysOnTop = this.alwaysOnTop,
            showNotification = this.showNotification,
            autoPlay = this.autoPlay,
            volume = this.volume,
            highquality = this.highquality,
            backgrounds = theme.playlist.backgrounds,
            autoupdate = this.autoupdate,
            scrobble = this.scrobble,
            lastFm = this.lastFm,
            enginers = this.enginers,
            proxy = this.proxy,
            downloads = this.downloads
        } = preferences;
        runInAction(() => {
            this.showTray = !!showTray;
            this.showMenuBarOnLinux = !!showMenuBarOnLinux;
            this.revertTrayIcon = !!revertTrayIcon;
            this.alwaysOnTop = !!alwaysOnTop;
            this.showNotification = !!showNotification;
            this.autoPlay = !!autoPlay;
            this.volume = +volume || 1;
            this.highquality = +highquality || 0;
            this.backgrounds = backgrounds || [];
            this.autoupdate = autoupdate;
            this.scrobble = scrobble;
            this.lastFm = lastFm;
            this.enginers = enginers;
            this.proxy = proxy;
            this.downloads = downloads;
        });

        // Save preferences
        this.save();
        return preferences;
    }

    @action
    save = async () => {
        const {
            showTray,
            showMenuBarOnLinux,
            revertTrayIcon,
            alwaysOnTop,
            showNotification,
            autoPlay,
            volume,
            highquality,
            backgrounds,
            autoupdate,
            scrobble,
            lastFm,
            enginers,
            proxy,
            downloads
        } = this;

        await storage.set('preferences', {
            showTray,
            showMenuBarOnLinux,
            revertTrayIcon,
            alwaysOnTop,
            showNotification,
            autoPlay,
            volume,
            highquality,
            backgrounds,
            autoupdate,
            scrobble,
            lastFm,
            enginers,
            proxy,
            downloads
        });

        ipcRenderer.send('update-preferences', {
            playing: controller.playing,
            showTray,
            alwaysOnTop,
            proxy,
            revertTrayIcon
        });
    };

    @action
    setShowTray = showTray => {
        this.showTray = showTray;
        this.save();
    };

    @action
    setShowMenuBarOnLinux = showMenuBarOnLinux => {
        this.showMenuBarOnLinux = showMenuBarOnLinux;
        this.save();
    };

    @action
    setRevertTrayIcon = revertTrayIcon => {
        this.revertTrayIcon = revertTrayIcon;
        this.save();
    };

    @action
    setAlwaysOnTop = alwaysOnTop => {
        this.alwaysOnTop = alwaysOnTop;
        this.save();
    };

    @action
    setShowNotification = showNotification => {
        this.showNotification = showNotification;
        this.save();
    };

    @action
    toggle() {
        this.show = !this.show;
    }

    @action
    hide() {
        this.show = false;
    }

    @action
    setAutoPlay = autoPlay => {
        this.autoPlay = autoPlay;
        this.save();
    };

    @action
    setBackgrounds = backgrounds => {
        this.backgrounds = backgrounds;
        this.save();
    };

    @action
    setLastfm = lastFm => {
        this.lastFm = lastFm;
        this.save();
    };

    @action
    setVolume = volume => {
        this.volume = volume;
        this.save();
    };

    @action
    setHighquality = highquality => {
        this.highquality = highquality;
        this.save();
    };

    @action setScrobble(scrobble) {
        this.scrobble = scrobble;
        this.save();
    }

    @action
    setAutoupdate = autoupdate => {
        this.autoupdate = autoupdate;
        this.save();
    };

    @action
    setDownloads = downloads => {
        this.downloads = downloads.path;
        this.save();
    };

    @action
    setProxy = proxy => {
        let newProxy = proxy;
        if (!/^http(s)?:\/\/\w+/i.test(proxy)) {
            newProxy = '';
        }

        this.proxy = newProxy;
        this.save();
    };

    @action
    connect = async () => {
        const { username, password } = this.lastfm;

        this.connecting = true;

        const success = await lastfm.initialize(username, password);

        if (success) {
            this.setLastfm({
                username,
                password,
                connected: `${username}:${password}`
            });
        }

        this.connecting = false;
    };

    @action
    setEnginers = enginers => {
        this.enginers = enginers;
        this.save();
    };
}

const self = new Preferences();
export default self;
