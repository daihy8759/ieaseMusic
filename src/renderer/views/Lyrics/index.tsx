import { observer } from 'mobx-react-lite';
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { useEffectOnce, useUpdateEffect } from 'react-use';
import styles from './index.module.less';
import Header from '/@/components/Header';
import Hero from '/@/components/Hero';
import Loader from '/@/components/Loader';
import ProgressImage from '/@/components/ProgressImage';
import { useStore } from '/@/context';

interface ILyricsProps extends RouteComponentProps {}

const Lyrics: React.SFC<ILyricsProps> = observer((props) => {
    const { lyrics, controller } = useStore();
    const { loading, list: lyricsList } = lyrics;
    const { song } = controller;

    useEffectOnce(() => {
        if (!song.id) {
            props.history.replace('/');
        }
        lyrics.getLyrics();
    });

    useUpdateEffect(() => {
        lyrics.getLyrics();
    }, [song.id]);

    if (loading) {
        return <Loader show />;
    }

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
});

export default Lyrics;
