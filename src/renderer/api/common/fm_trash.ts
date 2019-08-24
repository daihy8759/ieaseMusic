import { post } from 'utils/request';

interface FMTrash {
    id: number;
    time?: number;
}

export default (query: FMTrash) => {
    const path = `/weapi/radio/trash/add?alg=RT&songId=${query.id}&time=${query.time || 25}`;
    const data = {
        songId: query.id
    };
    return post(path, data);
};
