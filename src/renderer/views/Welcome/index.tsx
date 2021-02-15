import { Avatar, List, ListItem, ListItemText } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import classnames from 'classnames';
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { PLAYLIST_FM } from '../../../shared/interface/playlist';
import styles from './index.module.less';
import Playlist from './Playlist';
import Controller from '/@/components/Controller';
import { playListState, togglePlayListState, togglePlaySongState } from '/@/stores/controller';
import { homeListQuery } from '/@/stores/home';
import { loginState, profileState } from '/@/stores/me';

const useStyles = makeStyles({
    bigAvatar: {
        margin: 10,
        width: 64,
        height: 64,
    },
});

const ListItemLink = (props: any) => {
    return <ListItem button component="a" {...props} />;
};

const preparePlaylist = (homeData: any) => {
    if (homeData.hasFavorite) {
        return homeData.list[0];
    }
    if (homeData.hasRecommend) {
        return homeData.list[1];
    }
    return homeData[2];
};

const Welcome = () => {
    const logined = useRecoilValue(loginState);
    const playList = useRecoilValue(playListState);
    const profile = useRecoilValue(profileState);
    const homeData = useRecoilValue(homeListQuery);
    const setPlaylist = useSetRecoilState(togglePlayListState);
    const togglePlaySong = useSetRecoilState(togglePlaySongState);
    const togglePlayList = useSetRecoilState(togglePlayListState);

    const classes = useStyles();

    useEffect(() => {
        setPlaylist({ playList: preparePlaylist(homeData) });
    }, [homeData]);

    const play = (playlist: any) => {
        if (playList.id === playlist.id) {
            togglePlaySong(null);
        } else {
            togglePlayList(playlist);
        }
    };

    const renderProfile = () => {
        const link = `/user/${profile.userId}`;
        return (
            <article className={styles.profile}>
                <Link className="clearfix" to={link}>
                    <Avatar alt="" src={profile.avatarUrl} className={classes.bigAvatar} />
                </Link>

                <div className={styles.info}>
                    <p title={profile.nickname}>
                        <Link to={link}>{profile.nickname}</Link>
                    </p>
                    <span>{profile.signature || 'No signature~'}</span>
                </div>
            </article>
        );
    };

    return (
        <div className={styles.container}>
            <main>
                <aside className={styles.navs}>
                    {logined ? (
                        renderProfile()
                    ) : (
                        <Link
                            to="/login/0"
                            style={{
                                fontSize: 14,
                                letterSpacing: 2,
                            }}>
                            Sign in
                        </Link>
                    )}

                    <List component="nav" className={styles.menu}>
                        <ListItemLink href="#/search">
                            <ListItemText primary="Search" />
                        </ListItemLink>
                        <ListItemLink href="#/playlist/全部">
                            <ListItemText primary="Playlist" />
                        </ListItemLink>
                        <ListItemLink href="#/top">
                            <ListItemText primary="Top podcasts" />
                        </ListItemLink>
                        <ListItemLink
                            href="#/fm"
                            className={classnames({
                                [styles.playing]: playList.id === PLAYLIST_FM,
                            })}>
                            <ListItemText primary="Made For You" />
                        </ListItemLink>
                    </List>
                </aside>
                <Playlist logined={logined} list={homeData?.list} currentPlaylistId={playList.id} play={play} />
            </main>

            <Controller />
        </div>
    );
};

export default Welcome;
