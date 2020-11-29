import searchByType from 'api/search';
import IAlbum from 'interface/IAlbum';
import IArtist from 'interface/IArtist';
import { makeAutoObservable, runInAction } from 'mobx';

class Search {
    loading = false;

    playlists: any = [];

    albums: IAlbum[] = [];

    artists: IArtist[] = [];

    users: any = [];

    keyword = '';

    nextPlaylistsOffset = 0;

    nextAlbumsOffset = 0;

    nextArtistsOffset = 0;

    nextUsersOffset = 0;

    constructor() {
        makeAutoObservable(this);
    }

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

    getAlbums = async (keyword: string) => {
        this.loading = true;
        const data = await searchByType('10', keyword);
        runInAction(() => {
            this.albums = data.albums;
            this.nextAlbumsOffset = data.nextOffset;
            this.loading = false;
        });
    };

    loadMoreAlbums = async () => {
        if (this.nextAlbumsOffset === -1) {
            return;
        }
        const data = await searchByType('10', this.keyword, this.nextAlbumsOffset);
        runInAction(() => {
            this.albums.push(...data.albums);
            this.nextAlbumsOffset = data.nextOffset;
        });
    };

    getArtists = async (keyword: string) => {
        this.loading = true;
        const data = await searchByType('100', keyword);
        runInAction(() => {
            this.artists = data.artists;
            this.nextArtistsOffset = data.nextOffset;
            this.loading = false;
        });
    };

    loadMoreArtists = async () => {
        if (this.nextArtistsOffset === -1) {
            return;
        }
        const data = await searchByType('100', this.keyword, this.nextArtistsOffset);
        this.artists.push(...data.artists);
        this.nextArtistsOffset = data.nextOffset;
    };

    getUsers = async (keyword: string) => {
        this.loading = true;
        const data = await searchByType('1002', keyword);
        runInAction(() => {
            this.users = data.users;
            this.nextUsersOffset = data.nextOffset;
            this.loading = false;
        });
    };

    loadMoreUsers = async () => {
        if (this.nextUsersOffset === -1) {
            return;
        }
        const data = await searchByType('1002', this.keyword, this.nextUsersOffset);
        this.users.push(...data.users);
        this.nextUsersOffset = data.nextOffset;
    };
}

const self = new Search();
export default self;
