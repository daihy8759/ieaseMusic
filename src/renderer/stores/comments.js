import { getMusicComments } from 'api/comments';
import { action, observable, runInAction } from 'mobx';
import controller from './controller';

class Comments {
    @observable loading = true;

    @observable hotList = [];

    @observable newestList = [];

    @observable total = 0;

    @observable song = {
        album: {},
        artist: []
    };

    nextOffset = 0;

    @action
    async getList(song) {
        if (!song) {
            return;
        }
        this.loading = true;
        const data = await getMusicComments(song.id);
        runInAction(() => {
            this.song = song;
            this.hotList = data.hotList || [];
            this.newestList = data.newestList || [];
            this.total = data.total || 0;
            this.nextOffset = data.nextOffset;
            this.loading = false;
        });
    }

    @action
    like = async (id, liked) => {
        // const response = await axios.get(`/api/comments/like/${id}/${controller.song.id}/${+liked}`);
        // const { data } = response;
        // const { hotList, newestList } = this;
        // if (data.success === true) {
        //     const comment = [...hotList.slice(), ...newestList.slice()].find(e => e.commentId === id);
        //     comment.likedCount += liked ? 1 : -1;
        //     comment.liked = liked;
        // }
    };

    @action
    loadMore = async id => {
        if (!this.nextOffset) {
            return;
        }
        const data = await getMusicComments(id, this.nextOffset);
        this.newestList.push(...data.newestList);
        this.nextOffset = data.nextOffset;
    };
}

const self = new Comments();
export default self;
