import ISong from './ISong';

export default interface IPlayList {
    id?: string;
    songs?: ISong[];
    name?: string;
    link?: string;
}
