import { IconButton } from '@material-ui/core';
import { FavoriteSharp } from '@material-ui/icons';
import classnames from 'classnames';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import styles from './index.module.less';
import Header from '/@/components/Header';
import ProgressImage from '/@/components/ProgressImage';
import { playingState, songState, useToggleLike } from '/@/stores/controller';
import { isLiked } from '/@/stores/me';
import colors from '/@/utils/colors';
import helper from '/@/utils/helper';

const Singleton = () => {
    const history = useHistory();
    const song = useRecoilValue(songState);
    const playing = useRecoilValue(playingState);
    const toggleLike = useToggleLike();
    const liked = isLiked(song.id);

    if (!song.album?.cover) {
        history.push('/');
        return null;
    }

    return (
        <div className={styles.container}>
            <Header
                {...{
                    transparent: true,
                    showBack: true,
                }}
            />

            <summary className="pt-6 pl-4">
                <IconButton
                    className={classnames({
                        [styles.liked]: liked,
                    })}
                    style={{
                        cursor: 'pointer',
                        display: 'table',
                    }}
                    onClick={() => {
                        toggleLike({ id: song.id, like: !liked });
                    }}>
                    <FavoriteSharp />
                </IconButton>

                <span className={styles.highquality}>{helper.getRate(song)}</span>
            </summary>

            <main>
                <div
                    className={classnames('rounded-full opacity-75', styles.circle)}
                    style={{
                        filter: `drop-shadow(3mm 6mm 12mm ${colors.randomColor()})`,
                    }}>
                    <ProgressImage
                        className={classnames(playing ? 'animate-spin-slow' : 'animate-none')}
                        {...{
                            width: 260,
                            height: 260,
                            src: `${song.album.cover.replace(/\?.*$/, '')}?param=200y200`,
                        }}
                    />
                </div>
            </main>
        </div>
    );
};

export default Singleton;
