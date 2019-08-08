import { observable, action } from 'mobx';
import Api from 'api';
import helper from 'utils/helper';
import me from './me';
import controller from './controller';
import preferences from './preferences';

const { home } = Api;

class Home {
    @observable loading = true;

    @observable list = [];

    @action
    load = async () => {
        let list;
        if (me.hasLogin()) {
            list = await home.getHomeData(`${me.profile.userId}`);
            const [favorite, recommend] = list;

            me.rocking(favorite);

            if (favorite.size) {
                controller.setup(favorite);
            } else if (recommend.size) {
                controller.setup(recommend);
            } else {
                controller.setup(list[2]);
            }
        } else {
            list = await home.getHomeData();
            if (list.length === 0) {
                console.error('get home request failed');
                return;
            }
            controller.setup(list[0]);
        }

        if (preferences.autoPlay) {
            controller.play();
        } else {
            const { song } = controller.playlist.songs;
            controller.song = song || {};
        }

        list.forEach(e => {
            e.pallet = false;
        });

        this.list = list;

        // Get the color pallets
        await Promise.all(
            this.list.map(async (e, index) => {
                if (!e.cover) return;

                const pallet = await helper.getPallet(`${e.cover.replace(/\?param=.*/, '')}?param=20y20`);
                e.pallet = pallet;

                // Force update list
                this.updateShadow(e, index);
            })
        );

        return this.list;
    };

    @action async getList() {
        this.loading = true;

        await this.load();

        this.getList = Function;
        this.loading = false;
    }

    @action
    updateShadow = (e, index) => {
        this.list = [...this.list.slice(0, index), e, ...this.list.slice(index + 1, this.list.length)];
    };
}

const self = new Home();
export default self;
