import { followUser, getArtist, unFollowUser } from 'api/artist';
import IAlbum from 'interface/IAlbum';
import IArtist from 'interface/IArtist';
import IArtistProfile from 'interface/IArtistProfile';
import IPlayList from 'interface/IPlayList';
import { action, observable, runInAction } from 'mobx';

class Artist {
    @observable loading = true;

    // Profile of the artist
    @observable profile: IArtistProfile = {};

    // All albums of artist
    @observable albums: IAlbum[] = [];

    // Similar artists
    @observable similar: IArtist[] = [];

    // Contains 'id' and 'songs'
    @observable playlist: IPlayList = {
        songs: []
    };

    @observable desc = {
        briefDesc: ''
    };

    @action
    getArtist = async (id: number) => {
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
    follow = async (followed: boolean, id = this.profile.id) => {
        let data;
        if (followed) {
            data = await unFollowUser(id);
        } else {
            data = await followUser(id);
        }

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
