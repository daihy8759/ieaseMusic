import { getTopList } from 'api/top';
import { makeAutoObservable, runInAction } from 'mobx';

class Top {
    loading = false;

    list: any = [];

    constructor() {
        makeAutoObservable(this);
    }

    getList = async () => {
        this.loading = true;
        const list = await getTopList();
        runInAction(() => {
            this.list = list;
            this.loading = false;
        });
    };
}

const top = new Top();
export default top;
