import classnames from 'classnames';
import Controller from 'components/Controller';
import FadeImage from 'components/FadeImage';
import Header from 'components/Header';
import Loader from 'components/Loader';
import ProgressImage from 'components/ProgressImage';
import { inject } from 'mobx-react';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import helper from 'utils/helper';
import styles from './index.less';

@inject(stores => ({
    loading: stores.fm.loading,
    getFM: stores.fm.preload,
    songs: stores.fm.playlist.songs,
    song: stores.fm.song,
    next: stores.fm.next,
    play: stores.fm.play,
    like: stores.me.like,
    ban: stores.fm.ban,
    unlike: stores.me.unlike,
    isLiked: stores.me.isLiked,
    comments: stores.comments.total,
    playing: stores.controller.playing,
    isFMPlaying() {
        const { controller, fm } = stores;
        return controller.playlist.id === fm.playlist.id;
    },
    isPlaying() {
        const { controller, fm } = stores;

        return controller.playing && controller.playlist.id === fm.playlist.id;
    }
}))
class FM extends Component {
    componentWillMount() {
        const { getFM } = this.props;
        getFM();
    }

    seek(e) {
        const { width } = e.target.getBoundingClientRect();
        const padWidth = (window.innerWidth - width) / 2;
        const percent = (e.clientX - padWidth) / width;
        const { song } = this.props;
        const time = song.duration * percent;

        document.querySelector('audio').currentTime = time / 1000;
    }

    renderBG() {
        const { songs } = this.props;

        return (
            <div className={styles.covers}>
                {songs.map((e, index) => {
                    return (
                        <div className={styles.cover} key={index}>
                            <FadeImage src={e.album.cover} />
                        </div>
                    );
                })}
            </div>
        );
    }

    render() {
        const {
            loading,
            isFMPlaying,
            isLiked,
            like,
            unlike,
            ban,
            songs,
            song,
            next,
            comments,
            play,
            isPlaying
        } = this.props;
        let liked = false;

        if (loading) {
            return <Loader show />;
        }

        if (songs.length === 0) {
            return (
                <div>
                    <div className={styles.unavailable}>
                        <p>Oops, Personal FM only available on mainland.</p>

                        <Link to="/">Discover Music</Link>
                    </div>

                    <Controller />
                </div>
            );
        }

        liked = isLiked(song.id);

        return (
            <div className={styles.container}>
                <Header
                    {...{
                        transparent: true,
                        showBack: true
                    }}
                />

                {this.renderBG()}

                <section className={styles.main}>
                    <article>
                        <ProgressImage
                            {...{
                                height: 290,
                                width: 290,
                                src: song.album.cover
                            }}
                        />

                        <aside>
                            <p className={styles.title}>
                                <span title={song.name}>{song.name}</span>
                            </p>
                            <p className={styles.artists}>
                                <span>
                                    {song.artists.map((e, index) => {
                                        return (
                                            <Link key={index} to={e.link}>
                                                {e.name}
                                            </Link>
                                        );
                                    })}
                                </span>
                            </p>
                            <p className={styles.album}>
                                <span>
                                    <Link title={song.album.name} to={song.album.link}>
                                        {song.album.name}
                                    </Link>
                                </span>
                            </p>

                            <p className={styles.comments}>
                                <span>
                                    <Link title={song.album.name} to="/comments">
                                        {helper.humanNumber(comments)} Comments
                                    </Link>
                                </span>
                            </p>
                        </aside>
                    </article>

                    <div className={styles.bar} onClick={e => this.seek(e)}>
                        {isFMPlaying() && (
                            <div id="progress">
                                <div className={styles.playing} />
                                <div className={styles.buffering} />
                            </div>
                        )}
                    </div>

                    <div className={styles.controls}>
                        <i
                            className={classnames('remixicon-heart-fill', {
                                [styles.liked]: liked
                            })}
                            onClick={e => (liked ? unlike(song) : like(song))}
                        />

                        <i className="remixicon-arrow-down-circle-fill" onClick={e => ban(song.id)} />

                        <span onClick={e => play()}>
                            {isPlaying() ? (
                                <i className="remixicon-pause-fill" />
                            ) : (
                                <i className="remixicon-play-fill" />
                            )}
                        </span>

                        <i
                            className="remixicon-speed-fill"
                            onClick={next}
                            style={{
                                marginRight: 0
                            }}
                        />
                    </div>
                </section>
            </div>
        );
    }
}

export default FM;
