import { observable, action } from 'mobx';
import axios from 'axios';
import { getUserDetail } from 'api/user';

class User {
    @observable loading = true;

    @observable profile = {};

    @observable playlists = [];

    @action
    getUser = async userid => {
        this.loading = true;

        const data = await getUserDetail(userid);
        this.profile = data.profile;
        this.playlists = data.playlists;
        this.loading = false;
    };

    //  TODO: use api
    @action
    follow = async followed => {
        const data = await axios.get(
            followed ? `/api/user/unfollow/${this.profile.id}` : `/api/user/follow/${this.profile.id}`
        );

        if (data.success) {
            this.profile = Object.assign({}, this.profile, {
                followed: !followed
            });
        }
    };
}

const self = new User();
export default self;
