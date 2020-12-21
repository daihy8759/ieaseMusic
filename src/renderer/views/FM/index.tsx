import { fetchListState } from '@/stores/comments';
import { playingState, playListState, songState } from '@/stores/controller';
import { fetchFmListState } from '@/stores/fm';
import { isLiked, loginState, toggleLikeState } from '@/stores/me';
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
import Controller from 'components/Controller';
import FadeImage from 'components/FadeImage';
import Header from 'components/Header';
import ProgressImage from 'components/ProgressImage';
import React, { FC } from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import helper from 'utils/helper';
import styles from './index.less';

const useStyles = makeStyles({
    liked: {
        color: red[900],
        textShadow: `0 0 24px ${red[900]}`,
    },
});

interface IFMProps extends RouteComponentProps {}

const FM: FC<IFMProps> = (props) => {
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
    const playing = useRecoilValue(playingState);
    const comments = useRecoilValue(fetchListState(song.id));
    const toggleLike = useSetRecoilState(toggleLikeState);
    const fmPlayList = useRecoilValue(fetchFmListState);
    const { songs } = fmPlayList;

    const renderBg = () => {
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
        return playList.id === fmPlayList.id;
    };

    const isPlaying = () => {
        return playing && playList.id === fmPlayList.id;
    };

    const { total: commentsTotal } = comments;
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

                    <aside>
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
};

export default FM;
