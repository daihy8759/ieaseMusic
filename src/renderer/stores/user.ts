import { getUserDetail } from 'api/user';
import axios from 'axios';
import { action, observable, runInAction } from 'mobx';
import IUserProfile from 'interface/IUserProfile';

class User {
    @observable loading = true;

    @observable profile: IUserProfile = {};

    @observable playlists: any = [];

    @action
    getUser = async (userid: number) => {
        this.loading = true;

        const data = await getUserDetail(userid);
        runInAction(() => {
            this.profile = data.profile;
            this.playlists = data.playlists;
            this.loading = false;
        });
    };

    //  TODO: use api
    @action
    follow = async (followed: boolean) => {
        const data: any = await axios.get(
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
