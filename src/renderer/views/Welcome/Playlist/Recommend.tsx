import { ArrowForwardTwoTone } from '@material-ui/icons';
import classnames from 'classnames';
import React, { FC } from 'react';
import { Link } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import styles from '../index.module.less';
import Status from './Status';
import ProgressImage from '/@/components/ProgressImage';
import { playListState, useTogglePlayList, useToggleSong } from '/@/stores/controller';
import { HomeData } from '/@/stores/home';

interface RecommendProps {
    recommend: HomeData;
    currentPlaylistId?: string;
}

const Recommend: FC<RecommendProps> = (props) => {
    const { recommend, currentPlaylistId } = props;
    const playList = useRecoilValue(playListState);
    const togglePlaySong = useToggleSong();
    const togglePlayList = useTogglePlayList();

    const play = (playlist: any) => {
        if (playList.id === playlist.id) {
            togglePlaySong();
        } else {
            togglePlayList({
                playList: playlist,
            });
        }
    };

    return (
        <Link
            className={styles.clearfix}
            to="#"
            onClick={() => {
                if (play) {
                    play(recommend);
                }
            }}>
            <Status playing={currentPlaylistId === recommend.id} />

            <div className={styles.hovered}>
                <ArrowForwardTwoTone />
            </div>

            <figure className={classnames(styles.item, styles.recommend)}>
                <figcaption>
                    <ProgressImage
                        className={styles.cover}
                        pallet={recommend.pallet && recommend.pallet[1]}
                        {...{
                            height: 50,
                            width: 50,
                            src: recommend.cover,
                        }}
                    />

                    <summary>
                        <p>{recommend.name}</p>

                        <small>{`${recommend.size} Tracks`}</small>
                    </summary>
                </figcaption>
            </figure>
        </Link>
    );
};

export default Recommend;
