import { observable, action } from 'mobx';

class Share {
    @observable show = false;

    @action
    toggle = (song, show = !this.show) => {
        this.show = show;
    };
}

const self = new Share();
export default self;
