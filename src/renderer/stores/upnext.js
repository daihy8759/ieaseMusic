import { observable, action } from 'mobx';
import controller from './controller';

class UpNext {
    @observable show = false;

    @observable song = {
        album: {},
        artists: []
    };

    // Save the canceled song
    canceled = null;

    @action toggle(song, show = !this.show) {
        this.song = song;
        this.show = show;
    }

    @action
    hide() {
        this.show = false;
    }

    @action cancel(song = controller.song) {
        this.canceled = song;

        if (song) {
            this.show = false;
        }
    }
}

const self = new UpNext();
export default self;
