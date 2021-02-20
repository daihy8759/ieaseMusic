import IAlbum from '/@/interface/IAlbum';
import Artist from '/@/interface/Artist';

interface ISongData {
    src: string;
    isFlac: boolean;
}
export default interface ISong {
    id: number;
    name: string;
    waiting?: boolean;
    duration?: number;
    album: IAlbum;
    artists: Artist[];
    data?: ISongData;
}
