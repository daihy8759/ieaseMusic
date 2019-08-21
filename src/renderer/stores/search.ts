import searchByType from 'api/search';
import IAlbum from 'interface/IAlbum';
import IArtist from 'interface/IArtist';
import { action, observable, runInAction } from 'mobx';

class Search {
    @observable loading = false;

    @observable playlists: any = [];

    @observable albums: IAlbum[] = [];

    @observable artists: IArtist[] = [];

    @observable users: any = [];

    keyword = '';

    nextPlaylistsOffset = 0;

    nextAlbumsOffset = 0;

    nextArtistsOffset = 0;

    nextUsersOffset = 0;

    @action
    getPlaylists = async (keyword: string) => {
        this.loading = true;
        this.keyword = keyword;
        const data = await searchByType('1000', keyword);
        runInAction(() => {
            this.playlists = data.playlists;
            this.nextPlaylistsOffset = data.nextOffset;
            this.loading = false;
        });
    };

    @action
    loadMorePlaylists = async () => {
        if (this.nextPlaylistsOffset === -1) {
            return;
        }
        const data = await searchByType('1000', this.keyword, this.nextPlaylistsOffset);
        runInAction(() => {
            this.playlists.push(...data.playlists);
            this.nextPlaylistsOffset = data.nextOffset;
        });
    };

    @action
    getAlbums = async (keyword: string) => {
        this.loading = true;
        const data = await searchByType('10', keyword);
        runInAction(() => {
            // this.albums = data.albums;
            this.nextAlbumsOffset = data.nextOffset;
            this.loading = false;
        });
    };

    @action
    loadMoreAlbums = async () => {
        if (this.nextAlbumsOffset === -1) {
            return;
        }
        const data = await searchByType('10', this.keyword, this.nextAlbumsOffset);
        runInAction(() => {
            // this.albums.push(...data.albums);
            this.nextAlbumsOffset = data.nextOffset;
        });
    };

    @action
    getArtists = async (keyword: string) => {
        this.loading = true;
        const data = await searchByType('100', keyword);
        runInAction(() => {
            // this.artists = data.artists;
            this.nextArtistsOffset = data.nextOffset;
            this.loading = false;
        });
    };

    @action
    loadMoreArtists = async () => {
        if (this.nextArtistsOffset === -1) {
            return;
        }
        const data = await searchByType('100', this.keyword, this.nextArtistsOffset);
        // this.artists.push(...data.artists);
        this.nextArtistsOffset = data.nextOffset;
    };

    @action
    getUsers = async (keyword: string) => {
        this.loading = true;
        const data = await searchByType('1002', keyword);
        runInAction(() => {
            // this.users = data.users;
            this.nextUsersOffset = data.nextOffset;
            this.loading = false;
        });
    };

    @action
    loadMoreUsers = async () => {
        if (this.nextUsersOffset === -1) {
            return;
        }
        const data = await searchByType('1002', this.keyword, this.nextUsersOffset);
        // this.users.push(...data.users);
        this.nextUsersOffset = data.nextOffset;
    };
}

const self = new Search();
export default self;
