import { useStore } from '@/context';
import { Box, Tab, Tabs, Typography } from '@material-ui/core';
import { StarTwoTone } from '@material-ui/icons';
import classnames from 'classnames';
import Header from 'components/Header';
import ProgressImage from 'components/ProgressImage';
import format from 'date-fns/format';
import { observer } from 'mobx-react-lite';
import * as React from 'react';
import { Link } from 'react-router-dom';
import helper from 'utils/helper';
import * as styles from './index.less';

const a11yProps = (index: any) => {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`
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

const Search: React.FC = observer(() => {
    const { search, artist } = useStore();
    const searchRef = React.useRef<HTMLInputElement>();
    const [value, setValue] = React.useState(0);

    const loadMore = (e: any) => {
        const { loading } = search;
        if (loading) {
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

    const doSearch = async (e: any) => {
        if (e.keyCode !== 13) {
            return;
        }
        searchByKeyword(e.target.value);
    };

    const searchByKeyword = (value: any) => {
        const keyword = value && value.trim();
        if (!keyword) {
            return;
        }
        switch (value) {
            case 1:
                getAlbums(keyword);
                break;
            case 2:
                getArtists(keyword);
                break;
            case 3:
                getUsers(keyword);
            default:
                getPlaylists(keyword);
        }
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
                                <span>{helper.humanNumber(e.star)}</span>

                                <StarTwoTone />
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

    const handleTabChange = async (_: any, newValue: any) => {
        await setValue(newValue);
        searchByKeyword(searchRef.current.value);
    };

    const { loading, getPlaylists, getAlbums, getArtists, getUsers } = search;

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
});

export default Search;
