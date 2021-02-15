import { ArrowForwardTwoTone } from '@material-ui/icons';
import classnames from 'classnames';
import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../index.module.less';
import Status from './Status';
import ProgressImage from '/@/components/ProgressImage';
import { HomeData } from '/@/stores/home';
import helper from '/@/utils/helper';

interface PlaylistProps {
    list: HomeData[];
    currentPlaylistId?: string;
}

const Playlist = (props: PlaylistProps) => {
    const { list, currentPlaylistId } = props;

    return list.map((e, index) => {
        return (
            <Link className={styles.clearfix} key={index} to={e.link}>
                <Status playing={currentPlaylistId === e.id} />

                <div className={styles.hovered}>
                    <ArrowForwardTwoTone />
                </div>

                <figure className={classnames(styles.item, styles.large)}>
                    <ProgressImage
                        pallet={e.pallet && e.pallet[0]}
                        {...{
                            width: 360,
                            src: e.background,
                            className: classnames(styles.background, {
                                [styles.album]: e.type,
                            }),
                        }}
                    />

                    <figcaption>
                        <ProgressImage
                            className={styles.cover}
                            {...{
                                height: 50,
                                width: 50,
                                src: e.cover,
                            }}
                        />

                        <summary>
                            <p>{e.name}</p>

                            <small>
                                {e.type === 0 ? `${helper.humanNumber(e.played)} PLAYED` : `${e.size} Tracks`}
                            </small>
                        </summary>
                    </figcaption>
                </figure>
            </Link>
        );
    });
};

export default Playlist;
