import React from 'react';
import { useParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import Detail from './Detail';
import styles from './index.module.less';
import PlayStatus from './PlayStatus';
import Profile from './Profile';
import Header from '/@/components/Header';
import ProgressImage from '/@/components/ProgressImage';
import { fetchArtistState } from '/@/stores/artist';

const Artist = () => {
    const { id }: { id: string } = useParams();
    const artist = useRecoilValue(fetchArtistState(parseInt(id)));
    const { profile } = artist;

    return (
        <div className={styles.container}>
            <Header
                {...{
                    transparent: true,
                    showPlaylist: true,
                }}
            />

            <div className={styles.hero}>
                <ProgressImage
                    {...{
                        width: window.innerWidth,
                        height: window.innerWidth / (640 / 300),
                        src: profile.background,
                        thumb: (profile.background || '').replace(/\?.*$/, '?param=20y10'),
                    }}
                />
                <div className={styles.inner}>
                    <PlayStatus />
                    <Profile />
                </div>
            </div>

            <Detail />
        </div>
    );
};

export default Artist;
