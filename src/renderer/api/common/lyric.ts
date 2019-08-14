import { post } from 'utils/request';

interface ILyricQuery {
    id: number;
}
// 歌词
export default (query: ILyricQuery) => {
    const path = `/weapi/song/lyric?lv=-1&kv=-1&tv=-1`;
    const data = {
        id: query.id
    };
    return post(path, data, 'linuxApi');
};
