import { action, observable } from 'mobx';

class Share {
    @observable show = false;

    @action
    toggle = (show = !this.show) => {
        this.show = show;
    };
}

const self = new Share();
export default self;
