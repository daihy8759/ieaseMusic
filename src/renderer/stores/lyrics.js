import getLyric from 'api/lyrics';
import { action, observable, runInAction } from 'mobx';
import controller from './controller';

class Lyrics {
    @observable loading = true;

    @observable list = {};

    @action
    getLyrics = async () => {
        this.loading = true;

        const data = await getLyric(controller.song.id);
        runInAction(() => {
            this.list = data;
            this.loading = false;
        });
    };
}

const lyrics = new Lyrics();
export default lyrics;
