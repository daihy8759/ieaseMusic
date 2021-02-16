import { format } from 'date-fns';
import React, { FC } from 'react';
import { Link } from 'react-router-dom';
import { useRecoilValueLoadable } from 'recoil';
import styles from '../index.module.less';
import Loader from '/@/components/Loader';
import ProgressImage from '/@/components/ProgressImage';
import IAlbum from '/@/interface/IAlbum';
import { albumsQueryState } from '/@/stores/search';

interface AlbumsProps {
    albums: IAlbum[];
}

const Albums: FC<AlbumsProps> = (props) => {
    console.log(props);
    const { albums } = props;

    if (albums.length === 0) {
        return (
            <div className={styles.placeholder}>
                <span>Nothing ...</span>
            </div>
        );
    }
    return (
        <>
            {albums.map((e) => {
                return (
                    <Link className={styles.row} key={e.link} to={e.link}>
                        <ProgressImage
                            {...{
                                src: e.cover,
                                height: 40,
                                width: 40,
                            }}
                        />

                        <aside>
                            <span>{e.name}</span>

                            <span>{e.artist?.name}</span>

                            <span className={styles.publish}>{format(e.publishTime, 'L')}</span>
                        </aside>
                    </Link>
                );
            })}
        </>
    );
};

const AlbumsLoadable = () => {
    const albumsLoadable = useRecoilValueLoadable(albumsQueryState);

    switch (albumsLoadable.state) {
        case 'hasValue':
            const albums = albumsLoadable.contents;
            return <Albums albums={albums} />;
        case 'loading':
            return <Loader />;
        case 'hasError':
            return (
                <div className={styles.placeholder}>
                    <span>Nothing ...</span>
                </div>
            );
    }
};

export default AlbumsLoadable;
