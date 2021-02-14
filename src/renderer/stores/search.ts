import { makeAutoObservable, runInAction } from 'mobx';
import searchByType from '/@/api/search';
import IAlbum from '/@/interface/IAlbum';
import IArtist from '/@/interface/IArtist';

class Search {
    loading = false;

    scrollLoading = false;

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
        this.scrollLoading = true;
        const data = await searchByType('1000', this.keyword, this.nextPlaylistsOffset);
        runInAction(() => {
            data.playlists && this.playlists.push(...data.playlists);
            this.nextPlaylistsOffset = data.nextOffset;
            this.scrollLoading = false;
        });
    };

    getAlbums = async (keyword: string) => {
        this.loading = true;
        const data = await searchByType('10', keyword);
        runInAction(() => {
            this.albums = data.albums || [];
            this.nextAlbumsOffset = data.nextOffset;
            this.loading = false;
        });
    };

    loadMoreAlbums = async () => {
        if (this.nextAlbumsOffset === -1) {
            return;
        }
        this.scrollLoading = true;
        const data = await searchByType('10', this.keyword, this.nextAlbumsOffset);
        runInAction(() => {
            data.albums && this.albums.push(...data.albums);
            this.nextAlbumsOffset = data.nextOffset;
            this.scrollLoading = false;
        });
    };

    getArtists = async (keyword: string) => {
        this.loading = true;
        const data = await searchByType('100', keyword);
        runInAction(() => {
            this.artists = data.artists || [];
            this.nextArtistsOffset = data.nextOffset;
            this.loading = false;
        });
    };

    loadMoreArtists = async () => {
        if (this.nextArtistsOffset === -1) {
            return;
        }
        this.scrollLoading = true;
        const data = await searchByType('100', this.keyword, this.nextArtistsOffset);
        runInAction(() => {
            data.artists && this.artists.push(...data.artists);
            this.nextArtistsOffset = data.nextOffset;
            this.scrollLoading = false;
        });
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
        this.scrollLoading = true;
        const data = await searchByType('1002', this.keyword, this.nextUsersOffset);
        runInAction(() => {
            data.users && this.users.push(...data.users);
            this.nextUsersOffset = data.nextOffset;
            this.scrollLoading = false;
        });
    };
}

const self = new Search();
export default self;
