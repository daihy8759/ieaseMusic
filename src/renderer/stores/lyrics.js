import getLyric from 'api/lyrics';
import { action, observable } from 'mobx';
import controller from './controller';

class Lyrics {
    @observable loading = true;

    @observable list = {};

    @action
    getLyrics = async () => {
        this.loading = true;

        const data = await getLyric(controller.song.id);
        this.list = data;
        this.loading = false;
    };
}

const self = new Lyrics();
export default self;
