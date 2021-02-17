import React from 'react';
import { useParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { fetchArtistState } from '/@/stores/artist';

const Desc = () => {
    const { id }: { id: string } = useParams();
    const artist = useRecoilValue(fetchArtistState(parseInt(id)));
    const { desc } = artist;
    const { briefDesc } = desc as any;

    if (!briefDesc) {
        return <section className="nothing">Nothing ...</section>;
    }

    return <section className="p-4 indent-4">{briefDesc}</section>;
};

export default Desc;
