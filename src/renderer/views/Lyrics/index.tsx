import React, { FC } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import styles from './index.module.less';
import LyricList from './LyricList';
import Header from '/@/components/Header';
import Hero from '/@/components/Hero';
import ProgressImage from '/@/components/ProgressImage';
import { songState } from '/@/stores/controller';

const Lyrics: FC<RouteComponentProps> = (props) => {
    const song = useRecoilValue(songState);
    if (!song || !song.id) {
        props.history.replace('/');
    }
    return (
        <div className={styles.container}>
            <Header transparent showBack />

            <Hero location={props.location} />

            <aside id="lyrics" className={styles.lyrics}>
                <ProgressImage
                    {...{
                        height: window.innerHeight,
                        width: window.innerWidth,
                        src: song.album?.cover?.replace(/\?.*$/, ''),
                    }}
                />

                <section
                    onWheel={(e) => {
                        e.currentTarget.setAttribute('scrolling', 'true');
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.removeAttribute('scrolling');
                    }}>
                    <div
                        style={{
                            position: 'relative',
                            paddingTop: '10vh',
                            paddingBottom: '14vh',
                        }}>
                        <LyricList />
                    </div>
                </section>
            </aside>
        </div>
    );
};

export default Lyrics;
