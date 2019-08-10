import classnames from 'classnames';
import Header from 'components/Header';
import ProgressImage from 'components/ProgressImage';
import format from 'date-fns/format';
import { inject } from 'mobx-react';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import helper from 'utils/helper';
import styles from './index.less';

@inject(stores => ({
    loading: stores.search.loading,
    follow: stores.artist.follow,
    playlists: stores.search.playlists,
    getPlaylists: stores.search.getPlaylists,
    loadmorePlaylists: stores.search.loadmorePlaylists,
    albums: stores.search.albums,
    getAlbums: stores.search.getAlbums,
    loadmoreAlbums: stores.search.loadmoreAlbums,
    artists: stores.search.artists,
    getArtists: stores.search.getArtists,
    loadmoreArtists: stores.search.loadmoreArtists,
    users: stores.search.users,
    getUsers: stores.search.getUsers,
    loadmoreUsers: stores.search.loadmoreUsers
}))
class Search extends Component {
    loadmore(e) {
        const container = this.list;
        const { loading, loadmorePlaylists } = this.props;
        if (loading) {
            return;
        }

        if (container.scrollTop + container.offsetHeight + 50 > container.scrollHeight) {
            loadmorePlaylists();
        }
    }

    highlight(ele) {
        const eles = ele.parentElement.children;

        Array.from(eles).forEach(e => {
            e.classList.remove(styles.selected);
        });

        ele.classList.add(styles.selected);
    }

    selected(ele, state) {
        const keywords = this.search.value.trim();

        if (ele.classList.contains(styles.selected)) {
            return;
        }

        this.highlight(ele);
        this.setState(state);

        if (keywords) {
            setTimeout(() => state.search(keywords));
        }
    }

    doSearch(e) {
        if (e.keyCode !== 13) {
            return;
        }
        const keyword = e.target.value.trim();
        const { getPlaylists } = this.props;
        getPlaylists(keyword);
    }

    renderPlaylist() {
        const { playlists } = this.props;

        if (playlists.length === 0) {
            return (
                <div className={styles.placeholder}>
                    <span>Nothing ...</span>
                </div>
            );
        }

        return playlists.map(e => {
            return (
                <Link className={styles.row} key={e.link} onClick={() => this.reset()} to={e.link}>
                    <ProgressImage
                        {...{
                            src: e.cover,
                            height: 40,
                            width: 40
                        }}
                    />

                    <aside>
                        <span>{e.name}</span>

                        <div>
                            <span className={styles.star}>
                                {helper.humanNumber(e.star)}

                                <i className="ion-ios-star" />
                            </span>

                            <span className={styles.played}>{helper.humanNumber(e.played)} Played</span>
                        </div>

                        <span className={styles.tracks}>{e.size} Tracks</span>
                    </aside>
                </Link>
            );
        });
    }

    renderAlbums() {
        const { albums } = this.props;

        if (albums.length === 0) {
            return (
                <div className={styles.placeholder}>
                    <span>Nothing ...</span>
                </div>
            );
        }

        return albums.map(e => {
            return (
                <Link className={styles.row} key={e.link} onClick={() => this.reset()} to={e.link}>
                    <ProgressImage
                        {...{
                            src: e.cover,
                            height: 40,
                            width: 40
                        }}
                    />

                    <aside>
                        <span>{e.name}</span>

                        <span>{e.artist.name}</span>

                        <span className={styles.publish}>{format(e.publishTime, 'L')}</span>
                    </aside>
                </Link>
            );
        });
    }

    renderArtists() {
        const { artists, follow } = this.props;

        if (artists.length === 0) {
            return (
                <div className={styles.placeholder}>
                    <span>Nothing ...</span>
                </div>
            );
        }

        return artists.map(e => {
            return (
                <div className={styles.artist} key={e.link}>
                    <Link onClick={() => this.reset()} to={e.link}>
                        <ProgressImage
                            {...{
                                src: e.avatar,
                                height: 40,
                                width: 40
                            }}
                        />
                    </Link>

                    <aside>
                        <div>
                            <p>
                                <Link to={e.link}>{e.name}</Link>
                            </p>

                            <span>{e.size} ALBUMS</span>
                        </div>

                        <i
                            className={classnames('ion-ios-heart', {
                                liked: e.followed
                            })}
                            onClick={async ev => {
                                const { target } = ev;
                                const followed = target.classList.contains(styles.liked);

                                if (await follow(followed, e.id)) {
                                    if (followed) {
                                        target.classList.remove(styles.liked);
                                    } else {
                                        target.classList.add(styles.liked);
                                    }
                                }
                            }}
                        />
                    </aside>
                </div>
            );
        });
    }

    renderUsers() {
        const { users } = this.props;

        if (users.length === 0) {
            return (
                <div className={styles.placeholder}>
                    <span>Nothing ...</span>
                </div>
            );
        }

        return users.map(e => {
            return (
                <div className={styles.user} key={e.link}>
                    <Link onClick={() => this.reset()} to={e.link}>
                        <ProgressImage
                            {...{
                                src: e.avatar,
                                height: 64,
                                width: 64
                            }}
                        />
                    </Link>

                    <span className={styles.username}>{e.name}</span>
                </div>
            );
        });
    }

    render() {
        const {
            loading,
            getPlaylists,
            loadmorePlaylists,
            getAlbums,
            loadmoreAlbums,
            getArtists,
            loadmoreArtists,
            getUsers,
            loadmoreUsers
        } = this.props;

        return (
            <div className={styles.container}>
                <Header
                    {...{
                        transparent: true,
                        showBack: true
                    }}
                />

                <main>
                    <summary>
                        <input
                            ref={ele => {
                                this.search = ele;
                            }}
                            type="text"
                            onKeyUp={e => this.doSearch(e)}
                            placeholder="Search ..."
                        />
                    </summary>

                    <nav>
                        <span
                            className={styles.selected}
                            onClick={e =>
                                this.selected(e.target, {
                                    search: getPlaylists,
                                    loadmore: loadmorePlaylists,
                                    renderContent: () => this.renderPlaylist()
                                })
                            }>
                            Playlist
                        </span>
                        <span
                            onClick={e =>
                                this.selected(e.target, {
                                    search: getAlbums,
                                    loadmore: loadmoreAlbums,
                                    renderContent: () => this.renderAlbums()
                                })
                            }>
                            Album
                        </span>
                        <span
                            onClick={e =>
                                this.selected(e.target, {
                                    search: getArtists,
                                    loadmore: loadmoreArtists,
                                    renderContent: () => this.renderArtists()
                                })
                            }>
                            Singer
                        </span>
                        <span
                            onClick={e =>
                                this.selected(e.target, {
                                    search: getUsers,
                                    loadmore: loadmoreUsers,
                                    renderContent: () => this.renderUsers()
                                })
                            }>
                            User
                        </span>
                    </nav>

                    <section
                        className={styles.list}
                        onScroll={e => this.loadmore(e)}
                        ref={ele => {
                            this.list = ele;
                        }}>
                        {loading ? (
                            <div className={styles.placeholder}>
                                <span>Loading ...</span>
                            </div>
                        ) : (
                            this.renderPlaylist()
                        )}
                    </section>
                </main>
            </div>
        );
    }
}

export default Search;
