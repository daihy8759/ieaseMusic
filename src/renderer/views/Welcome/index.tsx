import { useStore } from '@/context';
import { Avatar, List, ListItem, ListItemText } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import classnames from 'classnames';
import { ArrowForwardTwoTone } from '@material-ui/icons';
import Controller from 'components/Controller';
import Indicator from 'components/Indicator';
import Loader from 'components/Loader';
import ProgressImage from 'components/ProgressImage';
import formatDistance from 'date-fns/formatDistance';
import { observer } from 'mobx-react-lite';
import * as React from 'react';
import { FunctionComponent } from 'react';
import { Link } from 'react-router-dom';
import { useEffectOnce } from 'react-use';
import helper from 'utils/helper';
import styles from './index.less';

interface IStatusProps {
    playing?: boolean;
}

const Status: FunctionComponent<IStatusProps> = props => {
    const { playing } = props;

    if (!playing) {
        return null;
    }

    return (
        <div className={styles.status}>
            <Indicator />
        </div>
    );
};

const useStyles = makeStyles({
    bigAvatar: {
        margin: 10,
        width: 64,
        height: 64
    }
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

    const renderFavorite = (favorite: any = {}) => {
        if (!favorite || favorite.size === 0) {
            return false;
        }

        return (
            <Link className={styles.clearfix} to={favorite.link || '#'}>
                {Status({ playing: controller.playlist.id === favorite.id })}

                <div className={styles.hovered}>
                    <ArrowForwardTwoTone />
                </div>

                <figure className={classnames(styles.item, styles.favorite)}>
                    <ProgressImage
                        {...{
                            className: styles.background,
                            width: 360,
                            src: favorite.background
                        }}
                    />

                    <figcaption>
                        <ProgressImage
                            className={styles.cover}
                            pallet={favorite.pallet && favorite.pallet[0]}
                            {...{
                                height: 50,
                                width: 50,
                                src: favorite.cover
                            }}
                        />

                        <summary>
                            <p>{favorite.name}</p>

                            <small>{favorite.updateTime && formatDistance(favorite.updateTime, new Date())}</small>
                        </summary>
                    </figcaption>
                </figure>
            </Link>
        );
    };

    const renderRecommend = (recommend: any = {}) => {
        return (
            <Link className={styles.clearfix} to="#" onClick={() => play(recommend)}>
                <Status playing={controller.playlist.id === recommend.id} />

                <div className={styles.hovered}>
                    <ArrowForwardTwoTone />
                </div>

                <figure className={classnames(styles.item, styles.recommend)}>
                    <figcaption>
                        <ProgressImage
                            className={styles.cover}
                            pallet={recommend.pallet && recommend.pallet[1]}
                            {...{
                                height: 50,
                                width: 50,
                                src: recommend.cover
                            }}
                        />

                        <summary>
                            <p>{recommend.name}</p>

                            <small>{`${recommend.size} Tracks`}</small>
                        </summary>
                    </figcaption>
                </figure>
            </Link>
        );
    };

    const renderPlaylist = (list: any) => {
        return list.map((e: any, index: number) => {
            return (
                <Link className={styles.clearfix} key={index} to={e.link}>
                    <Status playing={controller.playlist.id === e.id} />

                    <div className={styles.hovered}>
                        <ArrowForwardTwoTone />
                    </div>

                    <figure className={classnames(styles.item, styles.large)}>
                        <ProgressImage
                            pallet={e.pallet && e.pallet[0]}
                            {...{
                                width: 360,
                                src: e.background,
                                className: classnames(styles.background, {
                                    [styles.album]: e.type
                                })
                            }}
                        />

                        <figcaption>
                            <ProgressImage
                                className={styles.cover}
                                {...{
                                    height: 50,
                                    width: 50,
                                    src: e.cover
                                }}
                            />

                            <summary>
                                <p>{e.name}</p>

                                <small>
                                    {e.type === 0 ? `${helper.humanNumber(e.played)} PLAYED` : `${e.size} Tracks`}
                                </small>
                            </summary>
                        </figcaption>
                    </figure>
                </Link>
            );
        });
    };
    const { list } = home;
    const logined = me.hasLogin();
    const hasRecommend = logined && list.length > 1 && list[1].size;
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
                                letterSpacing: 2
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
                                [styles.playing]: controller.playlist.id === 'PERSONAL_FM'
                            })}>
                            <ListItemText primary="Made For You" />
                        </ListItemLink>
                    </List>
                </aside>

                {list.length ? (
                    <section className={styles.list}>
                        {logined ? renderFavorite(list[0]) : false}
                        {hasRecommend ? renderRecommend(list[1]) : false}
                        {renderPlaylist(logined ? list.slice(2, list.length) : list.slice())}
                    </section>
                ) : (
                    <div className={styles.placeholder} />
                )}
            </main>

            <Controller key={songId} />
        </div>
    );
});

export default Welcome;
