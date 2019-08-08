import { observable, action } from 'mobx';
import han from 'han';
import controller from './controller';

class Playing {
    @observable show = false;

    @observable filtered = [];

    @action
    toggle = (show = !this.show) => {
        this.show = show;
    };

    @action
    doFilter = text => {
        let songs = [];

        // Convert text to chinese pinyin
        const letterText = han.letter(text.trim());

        songs = controller.playlist.songs.filter(e => {
            return (
                false ||
                // Fuzzy match the song name
                han.letter(e.name).indexOf(letterText) > -1 ||
                // Fuzzy match the album name
                han.letter(e.album.name).indexOf(letterText) > -1 ||
                // Mathc the artist name
                e.artists.findIndex(artist => han.letter(artist.name).indexOf(letterText) > -1) !== -1
            );
        });

        this.filtered = songs;
    };

    filter = (text = '') => {
        clearTimeout(this.timer);
        this.timer = setTimeout(() => this.doFilter(text), 50);
    };
}

const self = new Playing();
export default self;
