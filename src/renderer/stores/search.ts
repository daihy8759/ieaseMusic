import { observable, action } from 'mobx';
import searchByType from 'api/search';
import axios from 'axios';
import IArtist from 'interface/IArtist';
import IAlbum from 'interface/IAlbum';

class Search {
    @observable loading = false;

    @observable playlists: any = [];

    @observable albums: IAlbum[] = [];

    @observable artists: IArtist[] = [];

    @observable users: any = [];

    nextHref4playlists = '';

    nextHref4albums = '';

    nextHref4artists = '';

    nextHref4users = '';

    @action
    getPlaylists = async (keyword: string) => {
        this.loading = true;

        const data = await searchByType('1000', keyword);
        this.playlists = data.playlists;
        this.nextHref4playlists = data.nextHref;
        this.loading = false;
    };

    @action
    loadmorePlaylists = async () => {
        if (!this.nextHref4playlists) {
            return;
        }

        const response = await axios.get(this.nextHref4playlists);
        const { data } = response;

        this.playlists.push(...data.playlists);
        this.nextHref4playlists = data.nextHref;
    };

    @action
    getAlbums = async (keyword: string) => {
        this.loading = true;

        const response = await axios.get(`/api/search/10/0/${keyword}`);
        const { data } = response;

        this.albums = data.albums;
        this.nextHref4albums = data.nextHref;
        this.loading = false;
    };

    @action
    loadmoreAlbums = async () => {
        if (!this.nextHref4albums) {
            return;
        }

        const response = await axios.get(this.nextHref4albums);
        const { data } = response;

        this.albums.push(...data.albums);
        this.nextHref4albums = data.nextHref;
    };

    @action
    getArtists = async (keyword: string) => {
        this.loading = true;

        const response = await axios.get(`/api/search/100/0/${keyword}`);
        const { data } = response;

        this.artists = data.artists;
        this.nextHref4artists = data.nextHref;
        this.loading = false;
    };

    @action
    loadmoreArtists = async () => {
        if (!this.nextHref4artists) {
            return;
        }

        const response = await axios.get(this.nextHref4artists);
        const { data } = response;

        this.artists.push(...data.artists);
        this.nextHref4artists = data.nextHref;
    };

    @action
    getUsers = async (keyword: string) => {
        this.loading = true;

        const response = await axios.get(`/api/search/1002/0/${keyword}`);
        const { data } = response;

        this.users = data.users;
        this.nextHref4users = data.nextHref;
        this.loading = false;
    };

    @action
    loadmoreUsers = async () => {
        if (!this.nextHref4users) {
            return;
        }

        const response = await axios.get(this.nextHref4users);
        const { data } = response;

        this.users.push(...data.users);
        this.nextHref4users = data.nextHref;
    };
}

const self = new Search();
export default self;