import { getTopList } from 'api/top';
import { action, observable, runInAction } from 'mobx';

class Top {
    @observable loading = true;

    @observable list: any = [];

    @action
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
