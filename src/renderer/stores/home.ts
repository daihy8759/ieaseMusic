import homeApi from '/@/api/home';
import { makeAutoObservable, runInAction } from 'mobx';
import helper from '/@/utils/helper';
import controller from './controller';
import me from './me';
import preferences from './preferences';

export interface HomeData {
    id?: number;
    name: string;
    type: number;
    played: number;
    size: any;
    link: string;
    pallet: any;
    cover: string;
    background: string;
    updateTime: number;
}

class Home {
    loading = true;

    list: HomeData[] = [];

    constructor() {
        makeAutoObservable(this);
    }

    async load() {
        let list: HomeData[];
        if (me.hasLogin()) {
            list = await homeApi.getHomeData(me.profile.userId, me.profile.cookie);
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
            const [song] = controller.playlist.songs;
            controller.song = song || { id: undefined, name: undefined };
        }
        // Get the color pallets
        await Promise.all(
            list.map(async (e) => {
                if (!e.cover) return;

                const pallet = await helper.getPallet(`${e.cover.replace(/\?param=.*/, '')}?param=20y20`);
                e.pallet = pallet;
            })
        );
        runInAction(() => {
            this.list = list;
        });
    }

    async getList() {
        this.loading = true;
        // @ts-ignore
        this.getList = Function;
        try {
            await this.load();
        } finally {
            runInAction(() => {
                this.loading = false;
            });
        }
    }
}

const self = new Home();
export default self;
