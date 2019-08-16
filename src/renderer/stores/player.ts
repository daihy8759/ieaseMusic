import { getPlayListDetail, getRecommend } from 'api/player';
import axios from 'axios';
import ISong from 'interface/ISong';
import { action, observable, runInAction } from 'mobx';
import * as pinyin from 'tiny-pinyin';
import helper from 'utils/helper';
import IArtist from 'interface/IArtist';

class Player {
    @observable loading = true;

    @observable songs: ISong[] = [];

    @observable filtered: ISong[] = [];

    @observable meta: any = {
        pallet: [[0, 0, 0]],
        author: []
    };

    // Show filter
    @observable searching = false;

    @observable keywords: string;

    // Recommend albums and playlist
    @observable recommend: any = [];

    // Recent user
    @observable users: any = [];

    // Similar artist
    @observable artists: IArtist[] = [];

    timer: number;

    @action
    getDetail = async (type: string, id: number) => {
        const detail = await getPlayListDetail(type, id);
        console.log(detail);
        if (detail && detail.meta) {
            const pallet = await helper.getPallet(detail.meta.cover);
            detail.meta.pallet = pallet;
            runInAction(() => {
                this.meta = detail.meta;
                // @ts-ignore
                this.songs.replace(detail.songs);
            });
        }
    };

    @action
    getRelated = async (song: ISong) => {
        if (!song.id || song.artists.length === 0) {
            return;
        }
        const data = await getRecommend(song.id, song.artists[0].id);
        if (data) {
            runInAction(() => {
                this.recommend = data.playlists;
                this.users = data.users;
                this.artists = data.artists;
            });
        }
    };

    @action
    subscribe = async (subscribed: boolean) => {
        const { meta }: any = this;
        const response = await axios.get(
            subscribed ? `/api/player/subscribe/${meta.id}` : `/api/player/unsubscribe/${meta.id}`
        );
        const { data } = response;

        if (data.success) {
            this.meta.subscribed = subscribed;
        }
    };

    @action
    toggleLoading(show = !this.loading) {
        this.loading = show;
    }

    @action
    toggleSearch(show = !this.searching) {
        this.searching = show;
    }

    @action
    doFilter(text: string) {
        let songs = [];

        // Convert text to chinese pinyin
        text = pinyin.convertToPinyin(text.trim());

        songs = this.songs.filter(e => {
            return (
                // Fuzzy match the song name
                pinyin.convertToPinyin(e.name).indexOf(text) > -1 ||
                // Fuzzy match the album name
                pinyin.convertToPinyin(e.album.name).indexOf(text) > -1 ||
                e.artists.findIndex(d => pinyin.convertToPinyin(d.name).indexOf(text) > -1) !== -1
            );
        });

        this.keywords = text;
        this.filtered = songs;
    }

    filter = (text = '') => {
        clearTimeout(this.timer);
        this.timer = window.setTimeout(() => this.doFilter(text), 50);
    };
}

const self = new Player();
export default self;
