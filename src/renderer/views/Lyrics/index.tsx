import { songState } from '@/stores/controller';
import { fetchLyricState } from '@/stores/lyrics';
import Header from 'components/Header';
import Hero from 'components/Hero';
import ProgressImage from 'components/ProgressImage';
import React, { FC } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import styles from './index.less';

const Lyrics: FC<RouteComponentProps> = (props) => {
    const song = useRecoilValue(songState);
    if (!song || !song.id) {
        props.history.replace('/');
    }
    const lyric = useRecoilValue(fetchLyricState(song.id));
    const { list: lyricsList } = lyric;

    const renderLyrics = () => {
        const times = lyricsList && Object.keys(lyricsList);
        if (!times || times.length === 0) {
            return (
                <div className={styles.placeholder}>
                    <span>Nothing ...</span>
                </div>
            );
        }
        return times.map((e) => {
            return (
                <p data-times={e} key={e}>
                    <span>{lyricsList[e]}</span>
                </p>
            );
        });
    };

    return (
        <div className={styles.container}>
            <Header transparent showBack />

            <Hero location={props.location} />

            <aside id="lyrics" className={styles.lyrics}>
                <ProgressImage
                    {...{
                        height: window.innerHeight,
                        width: window.innerWidth,
                        src: song.album.cover.replace(/\?.*$/, ''),
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
                        {renderLyrics()}
                    </div>
                </section>
            </aside>
        </div>
    );
};

export default Lyrics;
