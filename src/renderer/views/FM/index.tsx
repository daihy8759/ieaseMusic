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
import React, { FC } from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import styles from './index.module.less';
import Controller from '/@/components/Controller';
import FadeImage from '/@/components/FadeImage';
import Header from '/@/components/Header';
import ProgressImage from '/@/components/ProgressImage';
import { fetchListState } from '/@/stores/comments';
import { playingState, playListState, songState, toggleNextState } from '/@/stores/controller';
import { fetchFmListState } from '/@/stores/fm';
import { likedState, loginState, toggleLikeState } from '/@/stores/me';
import helper from '/@/utils/helper';

const useStyles = makeStyles({
    liked: {
        color: red[900],
        textShadow: `0 0 24px ${red[900]}`,
    },
});

const FM: FC<RouteComponentProps> = (props) => {
    const classes = useStyles();
    const hasLogin = useRecoilValue(loginState);
    if (!hasLogin) {
        props.history.replace('/login/1');
        return null;
    }
    const song = useRecoilValue(songState);
    if (!song || !song.id) {
        props.history.replace('/');
        return null;
    }
    const playList = useRecoilValue(playListState);
    const [playing, setPlaying] = useRecoilState(playingState);
    const comments = useRecoilValue(fetchListState(song.id));
    const toggleLike = useSetRecoilState(toggleLikeState);
    const toggleNext = useSetRecoilState(toggleNextState);
    const fmPlayList = useRecoilValue(fetchFmListState);
    const liked = useRecoilValue(likedState);
    const songs = fmPlayList.songs || [];

    const renderBg = () => {
        return (
            <div className={styles.covers}>
                {songs.map((e, index) => {
                    return (
                        <div className={styles.cover} key={index}>
                            <FadeImage src={e.album?.cover} />
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
        const time = (song.duration || 0) * percent;

        const audioElm = document.querySelector('audio');
        if (audioElm) {
            audioElm.currentTime = time / 1000;
        }
    };

    const isFMPlaying = () => {
        return playList.id === fmPlayList.id;
    };

    const isPlaying = () => {
        return playing && playList.id === fmPlayList.id;
    };

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
                            src: song.album?.cover,
                        }}
                    />

                    <aside className="space-y-2">
                        <p className={styles.title}>
                            <span title={song.name}>{song.name}</span>
                        </p>
                        <p className={styles.artists}>
                            <span>
                                {song.artists?.map((e: any, index: number) => {
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
                                <Link title={song.album?.name} to={song.album?.link || '#'}>
                                    {song.album?.name}
                                </Link>
                            </span>
                        </p>

                        <p className={styles.comments}>
                            <span>
                                <Link title={song.album?.name} to="/comments">
                                    {helper.humanNumber(comments.total)} Comments
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
                    <IconButton
                        onClick={() => {
                            toggleLike({ id: song.id, like: !liked });
                        }}>
                        {liked ? <FavoriteTwoTone className={classes.liked} /> : <FavoriteBorderTwoTone />}
                    </IconButton>
                    <IconButton onClick={() => ban(song.id)}>
                        <DeleteForeverTwoTone />
                    </IconButton>
                    <IconButton>
                        <CloudDownloadTwoTone />
                    </IconButton>
                    <IconButton onClick={() => setPlaying(!playing)}>
                        {isPlaying() ? <PauseCircleOutlineTwoTone /> : <PlayCircleOutlineTwoTone />}
                    </IconButton>
                    <IconButton onClick={() => toggleNext(true)}>
                        <FastForwardTwoTone />
                    </IconButton>
                </div>
            </section>
        </div>
    );
};

export default FM;
