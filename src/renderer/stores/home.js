import homeApi from 'api/home';
import { action, observable, runInAction } from 'mobx';
import helper from 'utils/helper';
import controller from './controller';
import me from './me';
import preferences from './preferences';

class Home {
    @observable loading = true;

    @observable list = [];

    @action
    async load() {
        let list;
        if (me.hasLogin()) {
            list = await homeApi.getHomeData(`${me.profile.userId}`);
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
            list = await homeApi.getHomeData();
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

        runInAction(() => {
            this.list = list;
        });
        // Get the color pallets
        list.map(async (e, index) => {
            if (!e.cover) return;

            const pallet = await helper.getPallet(`${e.cover.replace(/\?param=.*/, '')}?param=20y20`);
            e.pallet = pallet;

            // Force update list
            this.updateShadow(e, index);
        });
    }

    @action async getList() {
        this.loading = true;
        await this.load();
        runInAction(() => {
            this.loading = false;
        });
    }

    @action
    updateShadow = (e, index) => {
        this.list = [...this.list.slice(0, index), e, ...this.list.slice(index + 1, this.list.length)];
    };
}

const self = new Home();
export default self;
