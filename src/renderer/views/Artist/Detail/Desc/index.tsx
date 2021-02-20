import React from 'react';
import { useParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { fetchArtistDescState } from '/@/stores/artist';

const Desc = () => {
    const { id }: { id: string } = useParams();
    const desc = useRecoilValue(fetchArtistDescState(parseInt(id)));
    const { briefDesc } = desc as any;

    if (!briefDesc) {
        return <section className="nothing">Nothing ...</section>;
    }

    return <section className="p-4 indent-4">{briefDesc}</section>;
};

export default Desc;
