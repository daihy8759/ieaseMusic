import { useStore } from '@/context';
import classnames from 'classnames';
import Header from 'components/Header';
import ProgressImage from 'components/ProgressImage';
import format from 'date-fns/format';
import { observer } from 'mobx-react-lite';
import * as React from 'react';
import { Link } from 'react-router-dom';
import helper from 'utils/helper';
import * as styles from './index.less';

interface ISearchState {
    renderContent: any;
    search: any;
    loadMore: () => void;
}

const Search: React.FC = observer(() => {
    const { search, artist } = useStore();
    const listRef = React.useRef<HTMLElement>();
    const searchRef = React.useRef<HTMLInputElement>();
    const [searchInfo, setSearchInfo] = React.useState<ISearchState>();

    const loadMore = () => {
        const container = listRef.current;
        const { loading } = search;
        if (loading) {
            return;
        }

        if (container.scrollTop + container.offsetHeight + 50 > container.scrollHeight) {
            searchInfo.loadMore();
        }
    };

    const highlight = (ele: HTMLElement) => {
        const eles = ele.parentElement.children;

        Array.from(eles).forEach(e => {
            e.classList.remove(styles.selected);
        });

        ele.classList.add(styles.selected);
    };

    const reset = () => {
        setSearchInfo({
            renderContent: renderPlaylist,
            search: getPlaylists,
            loadMore: loadMorePlaylists
        });
    };

    const selected = (ele: any, state: ISearchState) => {
        const keywords = searchRef.current.value.trim();

        if (ele.classList.contains(styles.selected)) {
            return;
        }

        highlight(ele);
        setSearchInfo(state);

        if (keywords) {
            setTimeout(() => state.search(keywords));
        }
    };

    const doSearch = (e: any) => {
        if (e.keyCode !== 13) {
            return;
        }
        const keyword = e.target.value.trim();
        const { getPlaylists } = search;
        getPlaylists(keyword);
    };

    const renderPlaylist = () => {
        const { playlists } = search;

        if (playlists.length === 0) {
            return (
                <div className={styles.placeholder}>
                    <span>Nothing ...</span>
                </div>
            );
        }

        return playlists.map((e: any) => {
            return (
                <Link className={styles.row} key={e.link} onClick={reset} to={e.link}>
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

                                <i className="remixicon-star-fill" />
                            </span>

                            <span className={styles.played}>{helper.humanNumber(e.played)} Played</span>
                        </div>

                        <span className={styles.tracks}>{e.size} Tracks</span>
                    </aside>
                </Link>
            );
        });
    };

    const renderAlbums = () => {
        const { albums } = search;

        if (albums.length === 0) {
            return (
                <div className={styles.placeholder}>
                    <span>Nothing ...</span>
                </div>
            );
        }

        return albums.map(e => {
            return (
                <Link className={styles.row} key={e.link} onClick={reset} to={e.link}>
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
    };

    const renderArtists = () => {
        const { artists } = search;
        const { follow } = artist;

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
                    <Link onClick={reset} to={e.link}>
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
                            className={classnames('remixicon-heart-fill', {
                                liked: e.followed
                            })}
                            onClick={async (ev: any) => {
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
    };

    const renderUsers = () => {
        const { users } = search;

        if (users.length === 0) {
            return (
                <div className={styles.placeholder}>
                    <span>Nothing ...</span>
                </div>
            );
        }

        return users.map((e: any) => {
            return (
                <div className={styles.user} key={e.link}>
                    <Link onClick={reset} to={e.link}>
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
    };

    const {
        loading,
        getPlaylists,
        loadMorePlaylists,
        getAlbums,
        loadMoreAlbums,
        getArtists,
        loadMoreArtists,
        getUsers,
        loadMoreUsers
    } = search;

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
                    <input ref={searchRef} type="text" onKeyUp={doSearch} placeholder="Search ..." />
                </summary>

                <nav>
                    <span
                        className={styles.selected}
                        onClick={e =>
                            selected(e.target, {
                                search: getPlaylists,
                                loadMore: loadMorePlaylists,
                                renderContent: () => renderPlaylist()
                            })
                        }>
                        Playlist
                    </span>
                    <span
                        onClick={e =>
                            selected(e.target, {
                                search: getAlbums,
                                loadMore: loadMoreAlbums,
                                renderContent: () => renderAlbums()
                            })
                        }>
                        Album
                    </span>
                    <span
                        onClick={e =>
                            selected(e.target, {
                                search: getArtists,
                                loadMore: loadMoreArtists,
                                renderContent: () => renderArtists()
                            })
                        }>
                        Singer
                    </span>
                    <span
                        onClick={e =>
                            selected(e.target, {
                                search: getUsers,
                                loadMore: loadMoreUsers,
                                renderContent: () => renderUsers()
                            })
                        }>
                        User
                    </span>
                </nav>

                <section className={styles.list} onScroll={loadMore} ref={listRef}>
                    {loading ? (
                        <div className={styles.placeholder}>
                            <span>Loading ...</span>
                        </div>
                    ) : (
                        renderPlaylist()
                    )}
                </section>
            </main>
        </div>
    );
});

export default Search;
