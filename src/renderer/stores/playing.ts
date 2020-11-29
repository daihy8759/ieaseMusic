import ISong from 'interface/ISong';
import { makeAutoObservable } from 'mobx';
import * as pinyin from 'tiny-pinyin';
import controller from './controller';

class Playing {
    show = false;

    filtered: ISong[] = [];

    timer: number;

    constructor() {
        makeAutoObservable(this);
    }

    toggle = (show = !this.show) => {
        this.show = show;
    };

    doFilter = (text: string) => {
        let songs = [];

        // Convert text to chinese pinyin
        const letterText = pinyin.convertToPinyin(text.trim());

        songs = controller.playlist.songs.filter(e => {
            return (
                false ||
                // Fuzzy match the song name
                pinyin.convertToPinyin(e.name).indexOf(letterText) > -1 ||
                // Fuzzy match the album name
                pinyin.convertToPinyin(e.album.name).indexOf(letterText) > -1 ||
                // Mathc the artist name
                e.artists.findIndex(artist => pinyin.convertToPinyin(artist.name).indexOf(letterText) > -1) !== -1
            );
        });

        this.filtered = songs;
    };

    filter = (text = '') => {
        clearTimeout(this.timer);
        this.timer = window.setTimeout(() => this.doFilter(text), 50);
    };
}

const self = new Playing();
export default self;
