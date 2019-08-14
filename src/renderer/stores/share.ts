import { observable, action } from 'mobx';
import ISong from 'interface/ISong';

class Share {
    @observable show = false;

    @action
    toggle = (song: ISong, show = !this.show) => {
        this.show = show;
    };
}

const self = new Share();
export default self;
