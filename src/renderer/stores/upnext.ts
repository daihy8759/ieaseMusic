import ISong from 'interface/ISong';
import { makeAutoObservable } from 'mobx';
import controller from './controller';

class UpNext {
    show = false;

    song: ISong = {
        album: {},
        artists: []
    };

    // Save the canceled song
    canceled: ISong = null;

    constructor() {
        makeAutoObservable(this);
    }

    toggle(song: ISong, show = !this.show) {
        this.song = song;
        this.show = show;
    }

    hide() {
        this.show = false;
    }

    cancel(song = controller.song) {
        this.canceled = song;

        if (song) {
            this.show = false;
        }
    }
}

const self = new UpNext();
export default self;
