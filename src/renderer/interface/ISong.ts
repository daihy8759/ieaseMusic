import IAlbum from 'interface/IAlbum';
import IArtist from 'interface/IArtist';

export default interface ISong {
    id?: number;
    name?: string;
    duration?: string;
    album?: IAlbum;
    artists?: IArtist[];
}
