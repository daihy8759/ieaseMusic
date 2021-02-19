import classnames from 'classnames';
import React, { FC, Suspense } from 'react';
import { useNetwork, useWindowSize } from 'react-use';
import { useRecoilValue } from 'recoil';
import styles from './index.module.less';
import AudioPlayer from '/@/components/AudioPlayer';
import Menu from '/@/components/Menu';
import Offline from '/@/components/Offline';
import Playing from '/@/components/Playing';
import Preferences from '/@/components/Preferences';
import ProgressImage from '/@/components/ProgressImage';
import PlayerMode from '/@/components/Ripple/PlayerMode';
import PlayerNavigation from '/@/components/Ripple/PlayerNavigation';
import PlayerStatus from '/@/components/Ripple/PlayerStatus';
import VolumeUpDown from '/@/components/Ripple/VolumeUpDown';
import Share from '/@/components/Share';
import UpNext from '/@/components/UpNext';
import { songState } from '/@/stores/controller';

const Background = () => {
    const { width } = useWindowSize();
    const song = useRecoilValue(songState);

    return (
        <div className={styles.cover}>
            {song && song.id ? (
                <ProgressImage
                    className={styles.background}
                    {...{
                        width,
                        src: `${song.album?.cover?.replace(/\?param=.*/, '')}?param=800y800`,
                    }}
                />
            ) : (
                false
            )}
        </div>
    );
};

const Layout: FC = (props) => {
    const { children } = props;

    const networkState = useNetwork();
    if (!networkState.online) {
        return <Offline show />;
    }

    return (
        <div className={styles.container}>
            <main
                className={classnames({
                    [styles.viewport]: true,
                })}>
                {children}
            </main>
            <Suspense fallback={null}>
                <AudioPlayer />
            </Suspense>
            <UpNext />
            <Share />
            <Preferences />
            <Suspense fallback={null}>
                <Menu />
            </Suspense>
            <VolumeUpDown />
            <Playing />
            <PlayerNavigation />
            <PlayerMode />
            <PlayerStatus />
            <Background />
        </div>
    );
};

export default Layout;
