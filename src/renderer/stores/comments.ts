import { getMusicComments } from 'api/comments';
import { makeAutoObservable, runInAction } from 'mobx';
import ISong from 'interface/ISong';

class Comments {
    loading = true;

    hotList: any = [];

    newestList: any = [];

    total = 0;

    song: ISong;

    nextOffset = 0;

    constructor() {
        makeAutoObservable(this);
    }

    async getList(song: ISong) {
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

    like = async (id: number, liked: boolean) => {
        // const response = await axios.get(`/api/comments/like/${id}/${controller.song.id}/${+liked}`);
        // const { data } = response;
        // const { hotList, newestList } = this;
        // if (data.success === true) {
        //     const comment = [...hotList.slice(), ...newestList.slice()].find(e => e.commentId === id);
        //     comment.likedCount += liked ? 1 : -1;
        //     comment.liked = liked;
        // }
    };

    loadMore = async (id: number) => {
        if (!this.nextOffset) {
            return;
        }
        const data = await getMusicComments(id, this.nextOffset);
        runInAction(() => {
            this.newestList.push(...data.newestList);
            this.nextOffset = data.nextOffset;
        });
    };
}

const comments = new Comments();
export default comments;
