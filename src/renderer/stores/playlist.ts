import getPlayList from '/@/api/playlist';
import { makeAutoObservable, runInAction } from 'mobx';

class Playlist {
    loading = true;

    show = false;

    list: any = [];

    types = [
        {
            name: '全部',
            enable: true,
        },
        {
            name: '华语',
            enable: true,
        },
        {
            name: '欧美',
            enable: true,
        },
        {
            name: '日语',
            enable: true,
        },
        {
            name: '韩语',
            enable: true,
        },
        {
            name: '粤语',
            enable: true,
        },
        {
            name: '小语种',
            enable: true,
        },
        {
            name: '流行',
            enable: true,
        },
        {
            name: '摇滚',
            enable: true,
        },
        {
            name: '民谣',
            enable: true,
        },
        {
            name: '电子',
            enable: true,
        },
        {
            name: '舞曲',
            enable: true,
        },
        {
            name: '说唱',
            enable: true,
        },
        {
            name: '轻音乐',
            enable: true,
        },
        {
            name: '爵士',
            enable: true,
        },
        {
            name: '乡村',
            enable: true,
        },
        {
            name: 'R&B/Soul',
            enable: true,
        },
        {
            name: '古典',
            enable: true,
        },
        {
            name: '金属',
            enable: true,
        },
        {
            name: '蓝调',
            enable: true,
        },
        {
            name: '古风',
            enable: true,
        },
        {
            name: '后摇',
            enable: true,
        },
        {
            name: 'Bossa Nova',
            enable: true,
        },
        {
            name: '清晨',
            enable: true,
        },
        {
            name: '夜晚',
            enable: true,
        },
        {
            name: '学习',
            enable: true,
        },
        {
            name: '工作',
            enable: true,
        },
        {
            name: '午休',
            enable: true,
        },
        {
            name: '下午茶',
            enable: true,
        },
        {
            name: '地铁',
            enable: true,
        },
        {
            name: '驾车',
            enable: true,
        },
        {
            name: '运动',
            enable: true,
        },
        {
            name: '旅行',
            enable: true,
        },
        {
            name: '散步',
            enable: true,
        },
        {
            name: '酒吧',
            enable: true,
        },
        {
            name: '怀旧',
            enable: true,
        },
        {
            name: '清新',
            enable: true,
        },
        {
            name: '浪漫',
            enable: true,
        },
        {
            name: '性感',
            enable: true,
        },
        {
            name: '伤感',
            enable: true,
        },
        {
            name: '治愈',
            enable: true,
        },
        {
            name: '放松',
            enable: true,
        },
        {
            name: '孤独',
            enable: true,
        },
        {
            name: '感动',
            enable: true,
        },
        {
            name: '兴奋',
            enable: true,
        },
        {
            name: '快乐',
            enable: true,
        },
        {
            name: '安静',
            enable: true,
        },
        {
            name: '思念',
            enable: true,
        },
        {
            name: '影视原声',
            enable: true,
        },
        {
            name: 'ACG',
            enable: true,
        },
        {
            name: '校园',
            enable: true,
        },
        {
            name: '游戏',
            enable: true,
        },
        {
            name: '70后',
            enable: true,
        },
        {
            name: '80后',
            enable: true,
        },
        {
            name: '90后',
            enable: true,
        },
        {
            name: '网络歌曲',
            enable: true,
        },
        {
            name: 'KTV',
            enable: true,
        },
        {
            name: '经典',
            enable: true,
        },
        {
            name: '翻唱',
            enable: true,
        },
        {
            name: '吉他',
            enable: true,
        },
        {
            name: '钢琴',
            enable: true,
        },
        {
            name: '器乐',
            enable: true,
        },
        {
            name: '儿童',
            enable: true,
        },
        {
            name: '00后',
            enable: true,
        },
    ];

    type = '全部';

    nextOffset = 0;

    constructor() {
        makeAutoObservable(this);
    }

    getList = async (type = '全部') => {
        this.loading = true;

        const data = await getPlayList(type);
        const { playList, nextOffset } = data;
        runInAction(() => {
            this.list = playList;
            this.type = type;
            this.nextOffset = nextOffset;
            this.loading = false;
        });
    };

    // Scroll to load more data
    loadmore = async () => {
        if (!this.nextOffset) {
            return;
        }
        const { type, nextOffset } = this;
        const data = await getPlayList(type, nextOffset);
        const { playList, nextOffset: offset } = data;
        this.list.push(...playList);
        this.nextOffset = offset;
    };

    toggle(show = !this.show) {
        this.show = show;
    }
}

const self = new Playlist();
export default self;
