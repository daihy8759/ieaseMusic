import Artist from './Artist';

export default interface IAlbum {
    id?: number;
    name?: string;
    link: string;
    picUrl?: string;
    cover?: string;
    publishTime?: any;
    artist?: Artist;
}
