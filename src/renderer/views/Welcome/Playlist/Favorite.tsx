import { ArrowForwardTwoTone } from '@material-ui/icons';
import classnames from 'classnames';
import { formatDistance } from 'date-fns';
import React, { FC } from 'react';
import { Link } from 'react-router-dom';
import styles from '../index.module.less';
import Status from './Status';
import ProgressImage from '/@/components/ProgressImage';
import { HomeData } from '/@/stores/home';

interface FavoriteProps {
    favorite: HomeData;
    currentPlaylistId?: string;
}

const Favorite: FC<FavoriteProps> = (props) => {
    const { favorite, currentPlaylistId } = props;
    const link = favorite.link || '#';

    return (
        <Link className={styles.clearfix} to={link}>
            <Status playing={currentPlaylistId === favorite.id} />

            <div className={styles.hovered}>
                <ArrowForwardTwoTone />
            </div>

            <figure className={classnames(styles.item, styles.favorite)}>
                <ProgressImage
                    {...{
                        className: styles.background,
                        width: 360,
                        src: favorite.background,
                    }}
                />

                <figcaption>
                    <ProgressImage
                        className={styles.cover}
                        pallet={favorite.pallet && favorite.pallet[0]}
                        {...{
                            height: 50,
                            width: 50,
                            src: favorite.cover,
                        }}
                    />

                    <summary>
                        <p>{favorite.name}</p>

                        <small>{favorite.updateTime && formatDistance(favorite.updateTime, new Date())}</small>
                    </summary>
                </figcaption>
            </figure>
        </Link>
    );
};

export default Favorite;
