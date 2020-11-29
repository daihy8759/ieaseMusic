import { getUserDetail } from 'api/user';
import me from './me';
import axios from 'axios';
import { makeAutoObservable, runInAction } from 'mobx';
import IUserProfile from 'interface/IUserProfile';

class User {
    loading = false;

    profile: IUserProfile = {};

    playlists: any = [];

    constructor() {
        makeAutoObservable(this);
    }

    getUser = async (userid: number) => {
        this.loading = true;
        const cookie = me.profile.cookie;
        const data = await getUserDetail(userid, cookie);
        runInAction(() => {
            this.profile = data.profile;
            this.playlists = data.playlists;
            this.loading = false;
        });
    };

    //  TODO: use api

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
