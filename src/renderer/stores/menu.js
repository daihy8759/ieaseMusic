import { observable, action } from 'mobx';

class Menu {
    @observable show = false;

    @action
    toggle = (show = !this.show) => {
        this.show = show;
    };
}

const self = new Menu();
export default self;
