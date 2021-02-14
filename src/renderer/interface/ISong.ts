import IAlbum from '/@/interface/IAlbum';
import IArtist from '/@/interface/IArtist';

interface ISongData {
    src: string;
    isFlac: boolean;
}
export default interface ISong {
    id: number;
    name: string;
    waiting?: boolean;
    duration?: number;
    album?: IAlbum;
    artists?: IArtist[];
    data?: ISongData;
}
