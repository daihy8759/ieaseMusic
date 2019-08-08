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
import colors from 'utils/colors';
import helper from 'utils/helper';
import PlayerClasses from './classes';
import Search from './Search';

@inject(stores => ({
    loading: stores.player.loading,
    showLoading: () => stores.player.toggleLoading(true),
    hideLoading: () => setTimeout(() => stores.player.toggleLoading(false), 500),
    searching: stores.player.searching,
    keywords: stores.player.keywords,
    showSearch: () => stores.player.toggleSearch(true),
    hideSearch: () => stores.player.toggleSearch(false),
    meta: stores.player.meta,
    getList: async args => {
        const { id, type } = args;
        await stores.player.getDetail(type, id);
    },
    list: stores.player.songs,
    filter: stores.player.filter,
    filtered: stores.player.filtered,
    recommend: stores.player.recommend,
    artists: stores.player.artists,
    users: stores.player.users,
    getRelated: stores.player.getRelated,
    song: stores.controller.song,
    playing: stores.controller.playing,
    toggle: stores.controller.toggle,
    canitoggle: () => stores.controller.playlist.id === stores.player.meta.id,
    play: async songid => {
        const { controller, player } = stores;
        const { meta } = player;
        const currentPlayId = controller.playlist.id;
        const sameToPlaying = currentPlayId && currentPlayId === player.meta.id;

        if (!songid) {
            // Change the
            if (sameToPlaying) {
                controller.toggle();
            } else {
                // Play a new playlist
                controller.setup({
                    id: meta.id,
                    link: `/player/${meta.type}/${meta.id}`,
                    name: meta.name,
                    songs: player.songs
                });
                await controller.play();
            }

            return;
        }

        if (sameToPlaying) {
            // Song is playing
            if (songid === controller.song.id) {
                controller.toggle();
                return;
            }

            await controller.play(songid);
            return;
        }

        // Change playlist and play specific song
        controller.setup({
            id: meta.id,
            link: `/player/${meta.type}/${meta.id}`,
            name: meta.name,
            songs: player.songs
        });
        await controller.play(songid);
    },
    canifav: () => {
        const { player, me } = stores;

        // The type must be a playlist
        return (
            player.meta.type === 0 &&
            // And the playlist is not likes
            me.likes.get('id') !== player.meta.id
        );
    },

    hasLogin: stores.me.hasLogin
}))
class Player extends Component {
    componentWillMount = () => this.load(this.props);

    componentWillReceiveProps(nextProps) {
        const { song, match } = this.props;
        if (nextProps.match.params.id !== match.params.id) {
            this.load(nextProps);
            return;
        }

        if (nextProps.song.id !== song.id) {
            nextProps.getRelated(nextProps.song);
        }
    }

    componentDidUpdate() {
        const { classes, searching } = this.props;
        const ele = searching ? this.searching : this.list;
        if (!ele) {
            return;
        }
        const escapeClass = classes.active.replace('(', '\\(').replace(')', '\\)');
        const playing = ele.querySelector(`.${escapeClass}`);

        if (playing) {
            playing.scrollIntoViewIfNeeded();
        }
    }

    async load(props) {
        const {
            showLoading,
            hideLoading,
            getList,
            getRelated,
            match: { params },
            song
        } = props;

        showLoading();
        await getList(params);
        await getRelated(song);
        hideLoading();
    }

    renderPeople() {
        const { classes, hasLogin, users, artists } = this.props;
        const content = [];

        if (!hasLogin()) {
            return <div className={classes.nothing}>Nothing ...</div>;
        }

        if (users.length) {
            content.push(
                <div className={classes.users} key="users">
                    <h3>Listening history</h3>
                    {users.map((e, index) => {
                        return (
                            <Link className="clearfix tooltip" data-text={e.name} key={e.name + index} to={e.link}>
                                <FadeImage src={e.avatar} title={e.name} />
                            </Link>
                        );
                    })}
                </div>
            );
        }

        content.push(
            <div className={classes.artists} key="artists">
                <h3>Similar artist</h3>
                {artists.slice(0, content.length ? 5 : 10).map((e, index) => {
                    return (
                        <Link className="clearfix tooltip" data-text={e.name} key={e.name + index} to={e.link}>
                            <FadeImage src={e.avatar} title={e.name} />
                        </Link>
                    );
                })}
            </div>
        );

        return content;
    }

    renderList() {
        const { classes, playing, canitoggle, song, searching, keywords, filtered, play } = this.props;
        let { list } = this.props;
        const sameToPlaylist = canitoggle();

        list = searching && keywords ? filtered : list;

        if (list.length === 0) {
            return (
                <div
                    className={classes.nothing}
                    style={{
                        height: '100%'
                    }}>
                    Nothing ...
                </div>
            );
        }

        return list.map((e, index) => {
            return (
                <li
                    key={e.id}
                    className={classnames({
                        [classes.active]: sameToPlaylist && e.id === song.id
                    })}
                    onClick={async ev => {
                        await play(e.id);
                    }}>
                    {sameToPlaylist && e.id === song.id ? (
                        <i className={playing ? 'remixicon-pause-fill' : 'remixicon-play-fill'} />
                    ) : (
                        <i className="remixicon-play-fill" />
                    )}

                    <span className={classes.index}>{index}</span>

                    <span className={classes.name} title={e.name}>
                        {e.name}
                    </span>

                    <span className={classes.time}>{helper.getTime(e.duration)}</span>
                </li>
            );
        });
    }

    render() {
        const {
            classes,
            loading,
            meta,
            playing,
            recommend,
            canifav,
            searching,
            showSearch,
            hideSearch,
            filter,
            play,
            canitoggle
        } = this.props;

        return (
            <div className={classes.container}>
                <Loader show={loading} />

                <Header transparent showFav={canifav()} />

                <section>
                    <div
                        className={classes.hero}
                        style={{
                            backgroundImage: colors.randomGradient()
                        }}>
                        <ProgressImage
                            {...{
                                height: 260,
                                width: 260,
                                src: meta.cover
                            }}
                        />

                        <summary className={classes.summary}>
                            <p className={classes.title}>
                                <span>{meta.name}</span>
                            </p>

                            <p className={classes.author}>
                                <span>
                                    {meta.author.map((e, index) => {
                                        return (
                                            <Link key={e.name + index} to={e.link}>
                                                {e.name}
                                            </Link>
                                        );
                                    })}
                                </span>
                            </p>

                            <p
                                className={classes.subtitle}
                                style={{
                                    marginTop: 20
                                }}>
                                <span>{meta.company || `${helper.humanNumber(meta.played)} Played`}</span>
                            </p>
                        </summary>

                        <div className={classes.recommend}>
                            <div
                                style={{
                                    position: 'relative',
                                    display: 'inline-block',
                                    height: 260 / 3,
                                    width: 260 / 3,
                                    marginTop: -2
                                }}>
                                <div className={classes.play} onClick={() => play()}>
                                    {canitoggle() && playing ? (
                                        <i className="remixicon-pause-fill" />
                                    ) : (
                                        <i className="remixicon-play-fill" />
                                    )}
                                </div>
                            </div>

                            {recommend.map((e, index) => {
                                return (
                                    <Link className="clearfix" key={e.link + index} to={e.link}>
                                        <ProgressImage
                                            {...{
                                                height: 260 / 3,
                                                width: 260 / 3,
                                                src: e.cover
                                            }}
                                        />
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    <div className={classes.body}>
                        <div className={classes.people}>{this.renderPeople()}</div>

                        <div className={classes.list}>
                            <header>
                                <span onClick={showSearch}>Track/SEARCH</span>
                                <span>Time</span>
                            </header>
                            <ul
                                ref={ele => {
                                    this.list = ele;
                                }}>
                                {this.renderList()}
                            </ul>
                        </div>
                    </div>

                    <Search
                        {...{
                            filter,
                            show: searching,
                            close: () => {
                                hideSearch();
                                filter();
                            }
                        }}>
                        <div className={classes.list}>
                            <ul
                                ref={ele => {
                                    this.searching = ele;
                                }}>
                                {this.renderList()}
                            </ul>
                        </div>
                    </Search>
                </section>

                <Controller />
            </div>
        );
    }
}

export default injectSheet(PlayerClasses)(Player);
