import classnames from 'classnames';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import styles from './index.module.less';
import Header from '/@/components/Header';
import ProgressImage from '/@/components/ProgressImage';
import { playingState, songState } from '/@/stores/controller';
import colors from '/@/utils/colors';

const Singleton = () => {
    const history = useHistory();
    const song = useRecoilValue(songState);
    const playing = useRecoilValue(playingState);

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
