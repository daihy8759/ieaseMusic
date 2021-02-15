import { IconButton } from '@material-ui/core';
import { red } from '@material-ui/core/colors';
import {
    CloudDownloadTwoTone,
    DeleteForeverTwoTone,
    FastForwardTwoTone,
    FavoriteBorderTwoTone,
    FavoriteTwoTone,
    PauseCircleOutlineTwoTone,
    PlayCircleOutlineTwoTone,
} from '@material-ui/icons';
import { makeStyles } from '@material-ui/styles';
import { observer } from 'mobx-react-lite';
import React, { FC } from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { useEffectOnce } from 'react-use';
import styles from './index.module.less';
import Controller from '/@/components/Controller';
import FadeImage from '/@/components/FadeImage';
import Header from '/@/components/Header';
import Loader from '/@/components/Loader';
import ProgressImage from '/@/components/ProgressImage';
import { useStore } from '/@/context';
import helper from '/@/utils/helper';

const useStyles = makeStyles({
    liked: {
        color: red[900],
        textShadow: `0 0 24px ${red[900]}`,
    },
});

const FM: FC<RouteComponentProps> = observer((props) => {
    const { fm, me, comments, controller } = useStore();
    // @ts-ignore
    const classes = useStyles();
    useEffectOnce(() => {
        if (!me.hasLogin()) {
            props.history.replace('/login/1');
            return;
        }
        fm.preload();
    });

    if (fm.loading) {
        return <Loader show />;
    }

    const renderBg = () => {
        const { songs } = fm.playlist;

        return (
            <div className={styles.covers}>
                {songs.map((e, index) => {
                    return (
                        <div className={styles.cover} key={index}>
                            <FadeImage src={e.album.cover} />
                        </div>
                    );
                })}
            </div>
        );
    };

    const seek = (e: any) => {
        const { width } = e.target.getBoundingClientRect();
        const padWidth = (window.innerWidth - width) / 2;
        const percent = (e.clientX - padWidth) / width;
        const { song } = fm;
        const time = song.duration * percent;

        document.querySelector('audio').currentTime = time / 1000;
    };

    const isFMPlaying = () => {
        return controller.playlist.id === fm.playlist.id;
    };

    const isPlaying = () => {
        return controller.playing && controller.playlist.id === fm.playlist.id;
    };

    const { ban, song, next, play } = fm;
    const { songs } = fm.playlist;
    const { total: commentsTotal } = comments;
    const { isLiked, like, unlike } = me;
    let liked = false;

    if (songs.length === 0) {
        return (
            <div>
                <div className={styles.unavailable}>
                    <p>Oops, Personal FM only available on mainland.</p>

                    <Link to="/">Discover Music</Link>
                </div>

                <Controller />
            </div>
        );
    }

    liked = isLiked(song.id);

    return (
        <div className={styles.container}>
            <Header
                {...{
                    transparent: true,
                    showBack: true,
                }}
            />
            {renderBg()}
            <section className={styles.main}>
                <article>
                    <ProgressImage
                        {...{
                            height: 290,
                            width: 290,
                            src: song.album.cover,
                        }}
                    />

                    <aside className="space-y-2">
                        <p className={styles.title}>
                            <span title={song.name}>{song.name}</span>
                        </p>
                        <p className={styles.artists}>
                            <span>
                                {song.artists.map((e: any, index: number) => {
                                    return (
                                        <Link key={index} to={e.link}>
                                            {e.name}
                                        </Link>
                                    );
                                })}
                            </span>
                        </p>
                        <p className={styles.album}>
                            <span>
                                <Link title={song.album.name} to={song.album.link}>
                                    {song.album.name}
                                </Link>
                            </span>
                        </p>

                        <p className={styles.comments}>
                            <span>
                                <Link title={song.album.name} to="/comments">
                                    {helper.humanNumber(commentsTotal)} Comments
                                </Link>
                            </span>
                        </p>
                    </aside>
                </article>

                <div className={styles.bar} onClick={(e) => seek(e)}>
                    {isFMPlaying() && (
                        <div id="progress">
                            <div className={styles.playing} />
                            <div className={styles.buffering} />
                        </div>
                    )}
                </div>

                <div>
                    <IconButton onClick={() => (liked ? unlike(song) : like(song))}>
                        {liked ? <FavoriteTwoTone className={classes.liked} /> : <FavoriteBorderTwoTone />}
                    </IconButton>
                    <IconButton onClick={() => ban(song.id)}>
                        <DeleteForeverTwoTone />
                    </IconButton>
                    <IconButton>
                        <CloudDownloadTwoTone />
                    </IconButton>
                    <IconButton onClick={() => play()}>
                        {isPlaying() ? <PauseCircleOutlineTwoTone /> : <PlayCircleOutlineTwoTone />}
                    </IconButton>
                    <IconButton onClick={() => next()}>
                        <FastForwardTwoTone />
                    </IconButton>
                </div>
            </section>
        </div>
    );
});

export default FM;
