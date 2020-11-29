import { makeAutoObservable } from 'mobx';

class Menu {
    show = false;

    constructor() {
        makeAutoObservable(this);
    }

    toggle = (show = !this.show) => {
        this.show = show;
    };
}

const self = new Menu();
export default self;
