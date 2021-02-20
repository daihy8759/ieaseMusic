import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import styles from './index.module.less';
import ProgressImage from '/@/components/ProgressImage';
import Artist from '/@/interface/Artist';
import { fetchArtistSimilarState } from '/@/stores/artist';
import { loginState } from '/@/stores/me';

const Artists = () => {
    const hasLogin = useRecoilValue(loginState);
    const { id }: { id: string } = useParams();
    const similar = useRecoilValue(fetchArtistSimilarState(parseInt(id)));

    if (!hasLogin) {
        return <section className={styles.nothing}>Nothing ...</section>;
    }

    return (
        <section className={styles.artists}>
            {similar.map((e: Artist) => {
                return (
                    <div className={styles.artist} key={e.name}>
                        <Link className="tooltip" data-text={e.name} to={e.link}>
                            <ProgressImage
                                {...{
                                    height: 64,
                                    width: 64,
                                    src: e.avatar,
                                }}
                            />
                        </Link>
                    </div>
                );
            })}
        </section>
    );
};

export default Artists;
