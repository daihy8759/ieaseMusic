import { getArtist } from 'api/artist';
import axios from 'axios';
import { action, observable, runInAction } from 'mobx';

class Artist {
    @observable loading = true;

    // Profile of the artist
    @observable profile = {};

    // All albums of artist
    @observable albums = [];

    // Similar artists
    @observable similar = [];

    // Contains 'id' and 'songs'
    @observable playlist = {
        songs: []
    };

    @observable desc = {};

    @action
    getArtist = async id => {
        this.loading = true;
        const data = await getArtist(id);
        runInAction(() => {
            if (data) {
                this.profile = data.profile;
                this.playlist = data.playlist;
                this.albums = data.albums;
                this.similar = data.similar;
                this.desc = data.desc;
            }
            this.loading = false;
        });
    };

    @action
    follow = async (followed, id = this.profile.id) => {
        const response = await axios.get(followed ? `/api/artist/unfollow/${id}` : `/api/artist/follow/${id}`);
        const { data } = response;

        if (data.success) {
            runInAction(() => {
                this.profile = Object.assign({}, this.profile, {
                    followed: !followed
                });
            });
        }
        return data.success;
    };
}

const self = new Artist();
export default self;
