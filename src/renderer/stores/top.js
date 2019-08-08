import { getTopList } from 'api/top';
import { action, observable } from 'mobx';

class Top {
    @observable loading = true;

    @observable list = [];

    @action
    getList = async () => {
        this.loading = true;
        const list = await getTopList();
        this.list = list;
        this.loading = false;
    };
}

const self = new Top();
export default self;
