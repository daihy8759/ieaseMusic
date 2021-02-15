import { Box, IconButton, Tab, Tabs, Typography } from '@material-ui/core';
import { FavoriteSharp } from '@material-ui/icons';
import classnames from 'classnames';
import format from 'date-fns/format';
import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from 'recoil';
import styles from './index.module.less';
import Header from '/@/components/Header';
import ProgressImage from '/@/components/ProgressImage';
import { keywordState, playlistQueryState } from '/@/stores/search';
import helper from '/@/utils/helper';

const a11yProps = (index: any) => {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
};

interface TabPanelProps {
    children?: React.ReactNode;
    index: any;
    value: any;
}

const TabPanel = (props: TabPanelProps) => {
    const { children, value, index, ...other } = props;

    return (
        <Typography
            component="div"
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}>
            <Box p={3}>{children}</Box>
        </Typography>
    );
};

const Search = () => {
    const [keyword, setKeyword] = useRecoilState(keywordState);
    const playlists = useRecoilValue(playlistQueryState);

    const searchRef = useRef<HTMLInputElement>(null);
    const [value, setValue] = useState(0);

    const loadMore = (e: any) => {
        const { loading, scrollLoading } = search;
        if (loading || scrollLoading) {
            return;
        }
        const container = e.target;
        if (container.scrollTop + container.offsetHeight + 50 > container.scrollHeight) {
            switch (value) {
                case 1:
                    search.loadMoreAlbums();
                    break;
                case 2:
                    search.loadMoreArtists();
                    break;
                case 3:
                    search.loadMoreUsers();
                default:
                    search.loadMorePlaylists();
            }
        }
    };

    const reset = () => {};

    const renderPlaylist = () => {
        if (playlists.length === 0) {
            return (
                <div className={styles.placeholder}>
                    <span>Nothing ...</span>
                </div>
            );
        }

        return playlists.map((e: any) => {
            return (
                <Link className={styles.row} key={e.id} onClick={reset} to={e.link}>
                    <ProgressImage
                        {...{
                            src: e.cover,
                            height: 40,
                            width: 40,
                        }}
                    />

                    <aside>
                        <span>{e.name}</span>

                        <div>
                            <div className="rounded-full bg-amber-50 text-amber-900 px-2 py-0.5 hidden sm:flex lg:hidden xl:flex items-center space-x-1">
                                <dd>{helper.humanNumber(e.star)}</dd>
                                <dt className="text-amber-500">
                                    <svg width="16" height="20" fill="currentColor">
                                        <path d="M7.05 3.691c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.372 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.539 1.118l-2.8-2.034a1 1 0 00-1.176 0l-2.8 2.034c-.783.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.363-1.118L.98 9.483c-.784-.57-.381-1.81.587-1.81H5.03a1 1 0 00.95-.69L7.05 3.69z" />
                                    </svg>
                                </dt>
                            </div>

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

        return albums.map((e) => {
            return (
                <Link className={styles.row} key={e.link} onClick={reset} to={e.link}>
                    <ProgressImage
                        {...{
                            src: e.cover,
                            height: 40,
                            width: 40,
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

        return artists.map((e) => {
            return (
                <div className={styles.artist} key={e.link}>
                    <Link onClick={reset} to={e.link}>
                        <ProgressImage
                            {...{
                                src: e.avatar,
                                height: 40,
                                width: 40,
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

                        <IconButton
                            className={classnames({
                                liked: e.followed,
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
                            }}>
                            <FavoriteSharp />
                        </IconButton>
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
                                width: 64,
                            }}
                        />
                    </Link>

                    <span className={styles.username}>{e.name}</span>
                </div>
            );
        });
    };

    const handleTabChange = async (_: any, newValue: any) => {
        await setValue(newValue);
        searchByKeyword(searchRef.current.value);
    };

    return (
        <div className={styles.container}>
            <Header
                {...{
                    transparent: true,
                    showBack: true,
                }}
            />

            <main>
                <summary>
                    <input
                        type="text"
                        value={keyword}
                        placeholder="Search ..."
                        onChange={(e) => {
                            setKeyword(e.target.value);
                        }}
                    />
                </summary>
                <Tabs value={value} onChange={handleTabChange}>
                    <Tab label="Playlist" {...a11yProps(0)} />
                    <Tab label="Album" {...a11yProps(1)} />
                    <Tab label="Singer" {...a11yProps(2)} />
                    <Tab label="User" {...a11yProps(3)} />
                </Tabs>
                <TabPanel value={value} index={0}>
                    <section className={styles.list} onScroll={loadMore}>
                        {loading ? (
                            <div className={styles.placeholder}>
                                <span>Loading ...</span>
                            </div>
                        ) : (
                            renderPlaylist()
                        )}
                    </section>
                </TabPanel>
                <TabPanel value={value} index={1}>
                    <section className={styles.list} onScroll={loadMore}>
                        {loading ? (
                            <div className={styles.placeholder}>
                                <span>Loading ...</span>
                            </div>
                        ) : (
                            renderAlbums()
                        )}
                    </section>
                </TabPanel>
                <TabPanel value={value} index={2}>
                    <section className={styles.list} onScroll={loadMore}>
                        {loading ? (
                            <div className={styles.placeholder}>
                                <span>Loading ...</span>
                            </div>
                        ) : (
                            renderArtists()
                        )}
                    </section>
                </TabPanel>
                <TabPanel value={value} index={3}>
                    <section className={styles.list} onScroll={loadMore}>
                        {loading ? (
                            <div className={styles.placeholder}>
                                <span>Loading ...</span>
                            </div>
                        ) : (
                            renderUsers()
                        )}
                    </section>
                </TabPanel>
            </main>
        </div>
    );
};

export default Search;
