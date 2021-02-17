import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import IAlbum from '/@/interface/IAlbum';
import { fetchArtistState } from '/@/stores/artist';
import styles from './index.module.less';
import classnames from 'classnames';
import { playListState } from '/@/stores/controller';
import ProgressImage from '/@/components/ProgressImage';
import { format } from 'date-fns';

const Albums = () => {
    const playList = useRecoilValue(playListState);
    const { id }: { id: string } = useParams();
    const artist = useRecoilValue(fetchArtistState(parseInt(id)));
    const { albums } = artist;

    const highlightAlbum = (id?: number) => {
        if (!id) {
            return false;
        }
        return playList.id === id.toString();
    };

    if (albums) {
        return (
            <section className={styles.albums}>
                {albums.map((e: IAlbum) => {
                    return (
                        <div
                            className={classnames(styles.album, {
                                [styles.playing]: highlightAlbum(e.id),
                            })}
                            key={e.id}>
                            <Link to={e.link}>
                                <ProgressImage
                                    {...{
                                        height: 48,
                                        width: 48,
                                        src: e.cover,
                                    }}
                                />
                            </Link>
                            <div className={styles.info}>
                                <p data-name title={e.name}>
                                    {e.name}
                                </p>

                                <p data-time>{format(e.publishTime, 'L')}</p>
                            </div>
                        </div>
                    );
                })}
            </section>
        );
    }
    return <section className={styles.nothing}>Nothing ...</section>;
};

export default Albums;
