import { personFmState } from '@/stores/fm';
import { loginState, profileState } from '@/stores/me';
import { Avatar, List, ListItem, ListItemText } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import classnames from 'classnames';
import React from 'react';
import { Link } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import styles from './index.less';

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

const Profile = () => {
    const hasLogin = useRecoilValue(loginState);
    const profile = useRecoilValue(profileState);
    const playingPersonFm = useRecoilValue(personFmState);
    const classes = useStyles();

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
        <aside className={styles.navs}>
            {hasLogin ? (
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
                        [styles.playing]: playingPersonFm,
                    })}>
                    <ListItemText primary="Made For You" />
                </ListItemLink>
            </List>
        </aside>
    );
};

export default Profile;
