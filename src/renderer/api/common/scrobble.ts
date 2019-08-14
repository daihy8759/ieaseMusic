import { post } from 'utils/request';

interface IScrobbleQuery {
    id: number;
    sourceid: number;
    time: string;
}

export default (query: IScrobbleQuery) => {
    const path = '/weapi/feedback/weblog';
    const data = {
        logs: JSON.stringify([
            {
                action: 'play',
                json: {
                    download: 0,
                    end: 'playend',
                    id: query.id,
                    sourceId: query.sourceid,
                    time: query.time,
                    type: 'song',
                    wifi: 0
                }
            }
        ])
    };
    return post(path, data);
};
