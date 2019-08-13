import axios from 'axios';
import han from 'han';
import { action, observable, runInAction } from 'mobx';
import helper from 'utils/helper';
import { getPlayListDetail, getRecommend } from 'api/player';

class Player {
    @observable loading = true;

    @observable songs = [];

    @observable filtered = [];

    @observable meta = {
        pallet: [[0, 0, 0]],
        author: []
    };

    // Show filter
    @observable searching = false;

    @observable keywords;

    // Recommend albums and playlist
    @observable recommend = [];

    // Recent user
    @observable users = [];

    // Similar artist
    @observable artists = [];

    @action
    getDetail = async (type, id) => {
        const detail = await getPlayListDetail(type, id);
        if (detail && detail.meta) {
            const pallet = await helper.getPallet(detail.meta.cover);
            detail.meta.pallet = pallet;
            runInAction(() => {
                this.meta = detail.meta;
                this.songs.replace(detail.songs);
            });
        }
    };

    @action
    getRelated = async song => {
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
    subscribe = async subscribed => {
        const { meta } = this;
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
    doFilter(text) {
        let songs = [];

        // Convert text to chinese pinyin
        text = han.letter(text.trim());

        songs = this.songs.filter(e => {
            return (
                // Fuzzy match the song name
                han.letter(e.name).indexOf(text) > -1 ||
                // Fuzzy match the album name
                han.letter(e.album.name).indexOf(text) > -1 ||
                e.artists.findIndex(d => han.letter(d.name).indexOf(text) > -1) !== -1
            );
        });

        this.keywords = text;
        this.filtered = songs;
    }

    filter = (text = '') => {
        clearTimeout(this.timer);
        this.timer = setTimeout(() => this.doFilter(text), 50);
    };
}

const self = new Player();
export default self;
