import classnames from 'classnames';
import FadeImage from 'components/FadeImage';
import Indicator from 'components/Indicator';
import { inject, observer } from 'mobx-react';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import colors from 'utils/colors';
import styles from './index.less';

@inject(stores => ({
    show: stores.playing.show,
    search: stores.playing.filter,
    filtered: stores.playing.filtered,
    songs: stores.controller.playlist.songs,
    song: stores.controller.song,
    play: stores.controller.play,
    close: () => stores.playing.toggle(false)
}))
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
        const songs = Array.from(list.querySelectorAll('[data-id]'));
        let index = songs.findIndex(e => e.classList.contains(styles.active));

        if (index > -1) {
            songs[index].classList.remove(styles.active);
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
            active.classList.add(styles.active);
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
        const { play } = this.props;
        const active = this.list.querySelector(`.${styles.active}`);

        if (active) {
            const songid = active.dataset.id;
            play(songid);
        }
    }

    renderList() {
        const { songs = [], filtered, song = {}, play, close } = this.props;
        let list = songs;

        // Show the search result
        if (this.search && this.search.value.trim()) {
            list = filtered;
        }

        if (list.length === 0) {
            return <div className={styles.nothing}>Nothing ...</div>;
        }

        return list.map((e, index) => {
            const playing = e.id === song.id;

            return (
                <li key={e.id}>
                    <div className={styles.actions}>{playing ? <Indicator /> : false}</div>

                    <aside
                        className={classnames(styles.song, {
                            [styles.playing]: playing
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
                            <p className={styles.title}>{e.name}</p>
                            <p className={styles.author}>
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
                            className={styles.mask}
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
        const { show, search, close } = this.props;

        if (!show) {
            return false;
        }

        return (
            <div
                className={styles.container}
                onKeyUp={e => this.pressEscExit(e)}
                ref={ele => {
                    this.container = ele;
                }}
                tabIndex="-1">
                <div className={styles.overlay} onClick={close} />

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
                        className={styles.list}
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

export default Playing;
