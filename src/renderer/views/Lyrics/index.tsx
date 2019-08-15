import { useStore } from '@/context';
import Header from 'components/Header';
import Hero from 'components/Hero';
import Loader from 'components/Loader';
import ProgressImage from 'components/ProgressImage';
import ISong from 'interface/ISong';
import * as React from 'react';
import * as styles from './index.less';

interface ILyricsProps {
    getLyrics: any;
    song: ISong;
    lyrics: any;
    loading: boolean;
    location: any;
}

const Lyrics: React.SFC<ILyricsProps> = props => {
    const { lyrics, controller } = useStore();
    const { loading, list: lyricsList } = lyrics;
    const { song } = controller;

    if (loading || !song.id) {
        return <Loader show />;
    }

    React.useEffect(() => {
        lyrics.getLyrics();
    }, []);

    React.useEffect(() => {
        lyrics.getLyrics();
    }, [song.id]);

    const renderLyrics = () => {
        const times = Object.keys(lyricsList);

        if (times.length === 0) {
            return (
                <div className={styles.placeholder}>
                    <span>Nothing ...</span>
                </div>
            );
        }

        return times.map(e => {
            return (
                <p data-times={e} key={e}>
                    <span>{lyricsList[e]}</span>
                </p>
            );
        });
    };

    const { location } = props;

    return (
        <div className={styles.container}>
            <Header transparent showBack />

            <Hero location={location} />

            <aside id="lyrics" className={styles.lyrics}>
                <ProgressImage
                    {...{
                        height: window.innerHeight,
                        width: window.innerWidth,
                        src: song.album.cover.replace(/\?.*$/, '')
                    }}
                />

                <section
                    onWheel={e => {
                        e.currentTarget.setAttribute('scrolling', 'true');
                    }}
                    onMouseLeave={e => {
                        e.currentTarget.removeAttribute('scrolling');
                    }}>
                    <div
                        style={{
                            position: 'relative',
                            paddingTop: '10vh',
                            paddingBottom: '14vh'
                        }}>
                        {renderLyrics()}
                    </div>
                </section>
            </aside>
        </div>
    );
};

export default Lyrics;
