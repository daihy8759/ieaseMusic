import { ipcRenderer, remote } from 'electron';
import { action, observable, runInAction } from 'mobx';
import * as path from 'path';
import lastfm from 'utils/lastfm';
import * as pkg from '../../../package.json';
import storage from '../../shared/storage';
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
        password: '', // Your last.fm password
        connected: ''
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

    @observable disableProxy = false;

    @observable downloads = path.join(remote.app.getPath('music'), pkg.name);

    @observable backgrounds = [
        {
            type: '全部',
            background: ''
        },
        {
            type: '华语',
            background: ''
        },
        {
            type: '欧美',
            background: ''
        },
        {
            type: '日语',
            background: ''
        },
        {
            type: '韩语',
            background: ''
        },
        {
            type: '粤语',
            background: ''
        },
        {
            type: '小语种',
            background: ''
        },
        {
            type: '流行',
            background: ''
        },
        {
            type: '摇滚',
            background: ''
        },
        {
            type: '民谣',
            background: ''
        },
        {
            type: '电子',
            background: ''
        },
        {
            type: '舞曲',
            background: ''
        },
        {
            type: '说唱',
            background: ''
        },
        {
            type: '轻音乐',
            background: ''
        },
        {
            type: '爵士',
            background: ''
        },
        {
            type: '乡村',
            background: ''
        },
        {
            type: 'R&B/Soul',
            background: ''
        },
        {
            type: '古典',
            background: ''
        },
        {
            type: '金属',
            background: ''
        },
        {
            type: '蓝调',
            background: ''
        },
        {
            type: '古风',
            background: ''
        },
        {
            type: '后摇',
            background: ''
        },
        {
            type: 'Bossa Nova',
            background: ''
        },
        {
            type: '清晨',
            background: ''
        },
        {
            type: '夜晚',
            background: ''
        },
        {
            type: '学习',
            background: ''
        },
        {
            type: '工作',
            background: ''
        },
        {
            type: '午休',
            background: ''
        },
        {
            type: '下午茶',
            background: ''
        },
        {
            type: '地铁',
            background: ''
        },
        {
            type: '驾车',
            background: ''
        },
        {
            type: '运动',
            background: ''
        },
        {
            type: '旅行',
            background: ''
        },
        {
            type: '散步',
            background: ''
        },
        {
            type: '酒吧',
            background: ''
        },
        {
            type: '怀旧',
            background: ''
        },
        {
            type: '清新',
            background: ''
        },
        {
            type: '浪漫',
            background: ''
        },
        {
            type: '性感',
            background: ''
        },
        {
            type: '伤感',
            background: ''
        },
        {
            type: '治愈',
            background: ''
        },
        {
            type: '放松',
            background: ''
        },
        {
            type: '孤独',
            background: ''
        },
        {
            type: '感动',
            background: ''
        },
        {
            type: '兴奋',
            background: ''
        },
        {
            type: '快乐',
            background: ''
        },
        {
            type: '安静',
            background: ''
        },
        {
            type: '思念',
            background: ''
        },
        {
            type: '影视原声',
            background: ''
        },
        {
            type: 'ACG',
            background: ''
        },
        {
            type: '校园',
            background: ''
        },
        {
            type: '游戏',
            background: ''
        },
        {
            type: '70后',
            background: ''
        },
        {
            type: '80后',
            background: ''
        },
        {
            type: '90后',
            background: ''
        },
        {
            type: '网络歌曲',
            background: ''
        },
        {
            type: 'KTV',
            background: ''
        },
        {
            type: '经典',
            background: ''
        },
        {
            type: '翻唱',
            background: ''
        },
        {
            type: '吉他',
            background: ''
        },
        {
            type: '钢琴',
            background: ''
        },
        {
            type: '器乐',
            background: ''
        },
        {
            type: '儿童',
            background: ''
        },
        {
            type: '00后',
            background: ''
        }
    ];

    @action
    async init() {
        let preferences: any = storage.get('preferences');
        if (!preferences) {
            preferences = {};
            storage.set('preferences', preferences);
        }
        const {
            showTray = this.showTray,
            showMenuBarOnLinux = this.showMenuBarOnLinux,
            revertTrayIcon = this.revertTrayIcon,
            alwaysOnTop = this.alwaysOnTop,
            showNotification = this.showNotification,
            autoPlay = this.autoPlay,
            volume = this.volume,
            highquality = this.highquality,
            backgrounds = this.backgrounds,
            autoupdate = this.autoupdate,
            scrobble = this.scrobble,
            lastFm = this.lastFm,
            enginers = this.enginers,
            proxy = this.proxy,
            disableProxy = this.disableProxy,
            downloads = this.downloads
        } = preferences;
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
        this.disableProxy = disableProxy;
        this.downloads = downloads;

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
            disableProxy,
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
            disableProxy,
            downloads
        });

        ipcRenderer.send('update-preferences', {
            playing: controller.playing,
            showTray,
            alwaysOnTop,
            proxy,
            disableProxy,
            revertTrayIcon
        });
    };

    @action
    setShowTray = (showTray: boolean) => {
        this.showTray = showTray;
        this.save();
    };

    @action
    setShowMenuBarOnLinux = (showMenuBarOnLinux: boolean) => {
        this.showMenuBarOnLinux = showMenuBarOnLinux;
        this.save();
    };

    @action
    setRevertTrayIcon = (revertTrayIcon: boolean) => {
        this.revertTrayIcon = revertTrayIcon;
        this.save();
    };

    @action
    setAlwaysOnTop = (alwaysOnTop: boolean) => {
        this.alwaysOnTop = alwaysOnTop;
        this.save();
    };

    @action
    setShowNotification = (showNotification: boolean) => {
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
    setAutoPlay = (autoPlay: boolean) => {
        this.autoPlay = autoPlay;
        this.save();
    };

    @action
    setBackground = (index: number, background: any) => {
        this.backgrounds[index] = background;
        this.save();
    };

    @action
    setLastfm = (lastFm: any) => {
        this.lastFm = lastFm;
        this.save();
    };

    @action
    setVolume = (volume: number) => {
        this.volume = volume;
        this.save();
    };

    @action
    setHighquality = (highquality: number) => {
        this.highquality = highquality;
        this.save();
    };

    @action setScrobble(scrobble: boolean) {
        this.scrobble = scrobble;
        this.save();
    }

    @action
    setAutoupdate = (autoupdate: boolean) => {
        this.autoupdate = autoupdate;
        this.save();
    };

    @action
    setDownloads = (downloads: any) => {
        this.downloads = downloads.path;
        this.save();
    };

    @action
    enableProxy = async (proxyFlag: boolean) => {
        this.disableProxy = !proxyFlag;
        await this.save();
        // reload
        window.location.reload();
    };

    @action
    setProxy = (proxy: string) => {
        let newProxy = proxy;
        if (!/^(http(s)|socks5)?:\/\/\w+/i.test(proxy)) {
            newProxy = '';
        }

        this.proxy = newProxy;
        ipcRenderer.send('setProxy', newProxy);
        this.save();
    };

    @action
    connect = async () => {
        const { username, password } = this.lastFm;

        this.connecting = true;

        const success = await lastfm.initialize(username, password);

        if (success) {
            this.setLastfm({
                username,
                password,
                connected: `${username}:${password}`
            });
        }
        runInAction(() => {
            this.connecting = false;
        });
    };

    @action
    setEnginers = (enginers: any) => {
        this.enginers = enginers;
        this.save();
    };
}

const self = new Preferences();
export default self;
