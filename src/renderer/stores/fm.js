import { getPlaylist } from 'api/fm';
import axios from 'axios';
import { action, observable, runInAction } from 'mobx';
import controller from './controller';

class FM {
    @observable loading = true;

    @observable song = {};

    @observable playlist = {
        songs: []
    };

    preload = () => {
        controller.changeMode();
        this.shuffle();
        this.preload = Function;
    };

    @action
    async shuffle() {
        this.loading = true;

        const data = await getPlaylist();
        runInAction(() => {
            this.playlist = data;
            const [song] = this.playlist.songs;
            this.song = song;
            this.loading = false;
        });
    }

    @action
    play = () => {
        if (controller.playlist.id === this.playlist.id) {
            controller.toggle();
            return;
        }

        controller.setup(this.playlist);
        controller.play();
    };

    // Ban a song
    @action
    ban = async id => {
        const response = await axios.get(`/fm_trash?id=${id}`);

        if (response.data.code === 200) {
            this.next();
        }
    };

    @action
    next = async () => {
        let index = this.playlist.songs.findIndex(e => e.id === controller.song.id);

        if (controller.playlist.id !== this.playlist.id) {
            this.play();
            return;
        }

        if (++index < this.playlist.songs.length) {
            const next = this.playlist.songs[index];

            controller.play(next.id);
            return;
        }

        // Refresh the playlist
        await this.shuffle();
        controller.setup(this.playlist);
        controller.play();
    };
}

const fm = new FM();
export default fm;
