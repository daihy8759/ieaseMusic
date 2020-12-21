import { playingState, songState } from '@/stores/controller';
import { isLiked, toggleLikeState } from '@/stores/me';
import { IconButton } from '@material-ui/core';
import { FavoriteSharp } from '@material-ui/icons';
import classnames from 'classnames';
import Header from 'components/Header';
import ProgressImage from 'components/ProgressImage';
import * as React from 'react';
import { useUpdateEffect } from 'react-use';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import colors from 'utils/colors';
import helper from 'utils/helper';
import styles from './index.less';

const Singleton = () => {
    const circleRef = React.useRef<HTMLDivElement>();
    const song = useRecoilValue(songState);
    const playing = useRecoilValue(playingState);
    const toggleLike = useSetRecoilState(toggleLikeState);

    const liked = isLiked(song.id);

    useUpdateEffect(() => {
        const ele = circleRef.current;
        if (!ele) return;
        if (playing) {
            ele.firstElementChild.classList.remove(styles.pause);
        } else {
            ele.firstElementChild.classList.add(styles.pause);
        }
    }, [playing]);

    return (
        <div className={styles.container}>
            <Header
                {...{
                    transparent: true,
                    showBack: true,
                }}
            />

            <summary>
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
                    className={styles.circle}
                    style={{
                        filter: `drop-shadow(3mm 6mm 12mm ${colors.randomColor()})`,
                    }}
                    ref={circleRef}>
                    <ProgressImage
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
