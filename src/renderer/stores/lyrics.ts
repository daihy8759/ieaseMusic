import getLyric from '/@/api/lyrics';
import { makeAutoObservable, runInAction } from 'mobx';
import controller from './controller';

class Lyrics {
    loading = true;

    list: { [propName: string]: any } = {};

    constructor() {
        makeAutoObservable(this);
    }

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
