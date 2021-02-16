import { Avatar, List, ListItem, ListItemText } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import classnames from 'classnames';
import React from 'react';
import { Link } from 'react-router-dom';
import { useEffectOnce } from 'react-use';
import { useRecoilValue } from 'recoil';
import { PLAYLIST_FM } from '../../../shared/interface/playlist';
import styles from './index.module.less';
import Playlist from './Playlist';
import Controller from '/@/components/Controller';
import { playListState } from '/@/stores/controller';
import { homeListState, useSetupHome } from '/@/stores/home';
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

const Welcome = () => {
    const logined = useRecoilValue(loginState);
    const playList = useRecoilValue(playListState);
    const profile = useRecoilValue(profileState);
    const homeData = useRecoilValue(homeListState);
    const setupHome = useSetupHome();

    const classes = useStyles();

    useEffectOnce(() => {
        setupHome();
    });

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
                <Playlist logined={logined} list={homeData?.list} currentPlaylistId={playList.id} />
            </main>

            <Controller />
        </div>
    );
};

export default Welcome;
