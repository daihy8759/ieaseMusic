import { makeAutoObservable } from 'mobx';

class Share {
    show = false;

    constructor() {
        makeAutoObservable(this);
    }

    toggle = (show = !this.show) => {
        this.show = show;
    };
}

const self = new Share();
export default self;
