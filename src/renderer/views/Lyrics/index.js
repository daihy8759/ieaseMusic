import Header from 'components/Header';
import Hero from 'components/Hero';
import Loader from 'components/Loader';
import ProgressImage from 'components/ProgressImage';
import { inject } from 'mobx-react';
import React, { Component } from 'react';
import styles from './index.less';

@inject(stores => ({
    loading: stores.lyrics.loading,
    getLyrics: () => stores.lyrics.getLyrics(),
    lyrics: stores.lyrics.list,
    song: stores.controller.song
}))
class Lyrics extends Component {
    componentDidMount() {
        this.props.getLyrics();
    }

    componentDidUpdate(prevProps) {
        const { song, getLyrics } = this.props;
        if (song.id !== prevProps.song.id) {
            getLyrics();
        }
    }

    renderLyrics() {
        const { lyrics } = this.props;
        const times = Object.keys(lyrics);

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
                    <span>{lyrics[e]}</span>
                </p>
            );
        });
    }

    render() {
        const { loading, song, location } = this.props;

        if (loading || !song.id) {
            return <Loader show />;
        }

        return (
            <div className={styles.container}>
                <Header transparent showBack />

                <Hero location={location} />

                <aside id="lyrics" className={styles.lyrics}>
                    <ProgressImage
                        {...{
                            height: window.innerHieght,
                            width: window.innerHieght,
                            src: song.album.cover.replace(/\?.*$/, '')
                        }}
                    />

                    <section
                        onWheel={e => {
                            e.currentTarget.setAttribute('scrolling', true);
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
                            {this.renderLyrics()}
                        </div>
                    </section>
                </aside>
            </div>
        );
    }
}

export default Lyrics;
