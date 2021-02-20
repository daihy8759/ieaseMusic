import { IconButton } from '@material-ui/core';
import { FavoriteSharp } from '@material-ui/icons';
import classnames from 'classnames';
import React, { FC } from 'react';
import { Link } from 'react-router-dom';
import { useRecoilValueLoadable } from 'recoil';
import styles from '../index.module.less';
import Loader from '/@/components/Loader';
import ProgressImage from '/@/components/ProgressImage';
import Artist from '/@/interface/Artist';
import { artistsQueryState } from '/@/stores/search';

interface ArtistsProps {
    artists: Artist[];
}

const Artists: FC<ArtistsProps> = (props) => {
    const { artists } = props;

    if (!artists || artists.length === 0) {
        return (
            <div className={styles.placeholder}>
                <span>Nothing ...</span>
            </div>
        );
    }

    return (
        <>
            {artists.map((e) => {
                return (
                    <div className={styles.artist} key={e.link}>
                        <Link to={e.link}>
                            <ProgressImage
                                {...{
                                    src: e.avatar,
                                    height: 40,
                                    width: 40,
                                }}
                            />
                        </Link>

                        <aside>
                            <div>
                                <p>
                                    <Link to={e.link}>{e.name}</Link>
                                </p>

                                <span>{e.size} ALBUMS</span>
                            </div>

                            <IconButton
                                className={classnames({
                                    liked: e.followed,
                                })}
                                onClick={async (ev: any) => {
                                    const { target } = ev;
                                    const followed = target.classList.contains(styles.liked);

                                    if (await follow(followed, e.id)) {
                                        if (followed) {
                                            target.classList.remove(styles.liked);
                                        } else {
                                            target.classList.add(styles.liked);
                                        }
                                    }
                                }}>
                                <FavoriteSharp />
                            </IconButton>
                        </aside>
                    </div>
                );
            })}
        </>
    );
};

const ArtistsLoadable = () => {
    const artistsLoadable = useRecoilValueLoadable(artistsQueryState);

    switch (artistsLoadable.state) {
        case 'hasValue':
            const artists = artistsLoadable.contents;
            return <Artists artists={artists} />;
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

export default ArtistsLoadable;
