import classnames from 'classnames';
import FadeImage from 'components/FadeImage';
import Indicator from 'components/Indicator';
import { inject, observer } from 'mobx-react';
import React, { Component } from 'react';
import injectSheet from 'react-jss';
import { Link } from 'react-router-dom';
import colors from 'utils/colors';
import PlayingClasses from './classes';

@inject(stores => ({
    show: stores.playing.show,
    search: stores.playing.filter,
    filtered: stores.playing.filtered,
    songs: stores.controller.playlist.songs,
    song: stores.controller.song,
    play: stores.controller.play,
    close: () => stores.playing.toggle(false)
}))
@observer
class Playing extends Component {
    componentDidUpdate(prevProps) {
        const { show, song, filtered } = this.props;

        if (show) {
            const playing = Array.from(this.list.querySelectorAll('[data-id]')).find(e => e.dataset.id === song.id);

            if (playing) {
                playing.scrollIntoView();
            }
        }
        if (filtered.length !== prevProps.filtered.length) {
            this.list.scrollTop = 0;
        }
    }

    pressEscExit(e) {
        const { close } = this.props;
        if (e.keyCode === 27) {
            close();
        }
    }

    highlight(offset) {
        const { list } = this;
        const { classes } = this.props;
        const songs = Array.from(list.querySelectorAll('[data-id]'));
        let index = songs.findIndex(e => e.classList.contains(classes.active));

        if (index > -1) {
            songs[index].classList.remove(classes.active);
        }

        index += offset;

        if (index < 0) {
            // Fallback to the last element
            index = songs.length - 1;
        } else if (index > songs.length - 1) {
            // Fallback to the 1th element
            index = 0;
        }

        const active = songs[index];

        if (active) {
            // Keep active item always in the viewport
            active.classList.add(classes.active);
            list.scrollTop = active.offsetTop + active.offsetHeight - list.offsetHeight;
        }
    }

    navigation(e) {
        const { keyCode } = e;
        const offset = {
            // Up
            '38': -1,
            // Down
            '40': +1
        }[keyCode];

        if (offset) {
            this.highlight(offset);
        }

        if (keyCode !== 13) {
            return;
        }
        const { classes, play } = this.props;
        const active = this.list.querySelector(`.${classes.active}`);

        if (active) {
            const songid = active.dataset.id;
            play(songid);
        }
    }

    renderList() {
        const { classes, songs = [], filtered, song = {}, play, close } = this.props;
        let list = songs;

        // Show the search result
        if (this.search && this.search.value.trim()) {
            list = filtered;
        }

        if (list.length === 0) {
            return <div className={classes.nothing}>Nothing ...</div>;
        }

        return list.map((e, index) => {
            const playing = e.id === song.id;

            return (
                <li key={e.id}>
                    <div className={classes.actions}>{playing ? <Indicator /> : false}</div>

                    <aside
                        className={classnames(classes.song, {
                            [classes.playing]: playing
                        })}
                        data-id={e.id}
                        onClick={() => {
                            play(e.id);
                            close();
                        }}>
                        <Link to={e.album.link}>
                            <FadeImage src={e.album.cover} />
                        </Link>

                        <aside>
                            <p className={classes.title}>{e.name}</p>
                            <p className={classes.author}>
                                {e.artists.map(d => {
                                    return (
                                        <Link key={d.link} to={d.link}>
                                            {d.name}
                                        </Link>
                                    );
                                })}
                            </p>
                        </aside>

                        <div
                            className={classes.mask}
                            style={{
                                background: colors.randomGradient()
                            }}
                        />
                    </aside>
                </li>
            );
        });
    }

    render() {
        const { classes, show, search, close } = this.props;

        if (!show) {
            return false;
        }

        return (
            <div
                className={classes.container}
                onKeyUp={e => this.pressEscExit(e)}
                ref={ele => {
                    this.container = ele;
                }}
                tabIndex="-1">
                <div className={classes.overlay} onClick={close} />

                <section>
                    <header>
                        <input
                            onInput={e => search(e.target.value)}
                            onKeyUp={e => this.navigation(e)}
                            placeholder="Search..."
                            ref={ele => {
                                this.search = ele;
                            }}
                            type="text"
                        />
                    </header>

                    <ul
                        className={classes.list}
                        ref={ele => {
                            this.list = ele;
                        }}>
                        {this.renderList()}
                    </ul>
                </section>
            </div>
        );
    }
}

export default injectSheet(PlayingClasses)(Playing);
