import classnames from 'classnames';
import Controller from 'components/Controller';
import FadeImage from 'components/FadeImage';
import Header from 'components/Header';
import Loader from 'components/Loader';
import ProgressImage from 'components/ProgressImage';
import { inject } from 'mobx-react';
import React, { Component } from 'react';
import injectSheet from 'react-jss';
import { Link } from 'react-router-dom';
import helper from 'utils/helper';
import FMClasses from './classes';

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
        const { classes, songs } = this.props;

        return (
            <div className={classes.covers}>
                {songs.map((e, index) => {
                    return (
                        <div className={classes.cover} key={index}>
                            <FadeImage src={e.album.cover} />
                        </div>
                    );
                })}
            </div>
        );
    }

    render() {
        const {
            classes,
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
                    <div className={classes.unavailable}>
                        <p>Oops, Personal FM only available on mainland.</p>

                        <Link to="/">Discover Music</Link>
                    </div>

                    <Controller />
                </div>
            );
        }

        liked = isLiked(song.id);

        return (
            <div className={classes.container}>
                <Header
                    {...{
                        transparent: true,
                        showBack: true
                    }}
                />

                {this.renderBG()}

                <section className={classes.main}>
                    <article>
                        <ProgressImage
                            {...{
                                height: 290,
                                width: 290,
                                src: song.album.cover
                            }}
                        />

                        <aside>
                            <p className={classes.title}>
                                <span title={song.name}>{song.name}</span>
                            </p>
                            <p className={classes.artists}>
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
                            <p className={classes.album}>
                                <span>
                                    <Link title={song.album.name} to={song.album.link}>
                                        {song.album.name}
                                    </Link>
                                </span>
                            </p>

                            <p className={classes.comments}>
                                <span>
                                    <Link title={song.album.name} to="/comments">
                                        {helper.humanNumber(comments)} Comments
                                    </Link>
                                </span>
                            </p>
                        </aside>
                    </article>

                    <div className={classes.bar} onClick={e => this.seek(e)}>
                        {isFMPlaying() && (
                            <div id="progress">
                                <div className={classes.playing} />
                                <div className={classes.buffering} />
                            </div>
                        )}
                    </div>

                    <div className={classes.controls}>
                        <i
                            className={classnames('ion-ios-heart', {
                                [classes.liked]: liked
                            })}
                            onClick={e => (liked ? unlike(song) : like(song))}
                        />

                        <i className="ion-android-arrow-down" onClick={e => ban(song.id)} />

                        <span onClick={e => play()}>
                            {isPlaying() ? <i className="ion-ios-pause" /> : <i className="ion-ios-play" />}
                        </span>

                        <i
                            className="ion-ios-fastforward"
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

export default injectSheet(FMClasses)(FM);
