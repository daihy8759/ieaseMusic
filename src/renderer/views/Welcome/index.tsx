import { Avatar, List, ListItem, ListItemText } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import classnames from 'classnames';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { Link } from 'react-router-dom';
import { useEffectOnce } from 'react-use';
import { PLAYLIST_FM } from '../../../shared/interface/playlist';
import styles from './index.module.less';
import Playlist from './Playlist';
import Controller from '/@/components/Controller';
import Loader from '/@/components/Loader';
import { useStore } from '/@/context';

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

const Welcome = observer(() => {
    const { me, controller, home } = useStore();
    const classes = useStyles();
    useEffectOnce(() => {
        home.getList();
    });

    const play = (playlist: any) => {
        if (controller.playlist.id === playlist.id) {
            controller.toggle();
        }
        controller.setup(playlist);
        controller.play();
    };

    const renderProfile = () => {
        const { profile } = me;
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

    const { list } = home;
    const logined = me.hasLogin();
    const songId = controller.song ? controller.song.id : '';

    return (
        <div className={styles.container}>
            <Loader show={home.loading} />
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
                                [styles.playing]: controller.playlist.id === PLAYLIST_FM,
                            })}>
                            <ListItemText primary="Made For You" />
                        </ListItemLink>
                    </List>
                </aside>
                <Playlist logined={logined} currentPlaylistId={controller.playlist.id} play={play} />
            </main>

            <Controller key={songId} />
        </div>
    );
});

export default Welcome;
