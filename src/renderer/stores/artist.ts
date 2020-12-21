import { getArtist } from 'api/artist';
import { selectorFamily } from 'recoil';

export const fetchArtistState = selectorFamily({
    key: 'artist',
    get: (id: number) => async () => {
        const data = await getArtist(id);
        return {
            profile: data.profile,
            playlist: data.playlist,
            albums: data.albums,
            similar: data.similar,
            desc: data.desc
        };
    }
});
