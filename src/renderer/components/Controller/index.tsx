import { IconButton, Tooltip } from '@material-ui/core';
import { red } from '@material-ui/core/colors';
import {
    CloudDownloadTwoTone,
    FastForwardTwoTone,
    FastRewindTwoTone,
    FavoriteBorderTwoTone,
    FavoriteTwoTone,
    PauseCircleOutlineTwoTone,
    PlayCircleOutlineTwoTone,
    ReorderTwoTone,
    RepeatTwoTone,
    ShuffleTwoTone,
} from '@material-ui/icons';
import { makeStyles } from '@material-ui/styles';
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from 'recoil';
import { PlayMode } from '../../../shared/interface/controller';
import styles from './index.module.less';
import ProgressImage from '/@/components/ProgressImage';
import IArtist from '/@/interface/IArtist';
import { fetchListState } from '/@/stores/comments';
import {
    playingState,
    playListState,
    playModeState,
    songState,
    useToggleNext,
    useTogglePrev,
} from '/@/stores/controller';
import { isLiked, likedState, loginState, useToggleLike } from '/@/stores/me';
import colors from '/@/utils/colors';
import helper from '/@/utils/helper';

const useStyles = makeStyles({
    liked: {
        color: red[900],
        textShadow: `0 0 24px ${red[900]}`,
    },
});

const MODES = [PlayMode.PLAYER_LOOP, PlayMode.PLAYER_REPEAT, PlayMode.PLAYER_SHUFFLE];

const Controller = () => {
    const classes = useStyles();
    const song = useRecoilValue(songState);
    const { duration } = song;
    const [mode, setMode] = useRecoilState(playModeState);
    const [playing, setPlaying] = useRecoilState(playingState);
    const playList = useRecoilValue(playListState);
    const logined = useRecoilValue(loginState);
    const toggleNext = useToggleNext();
    const togglePrev = useTogglePrev();
    const toggleLike = useToggleLike();
    const comments = useRecoilValue(fetchListState(song.id));
    const [liked, setLiked] = useRecoilState(likedState);

    const fetchLiked = async () => {
        setLiked(await isLiked(song.id));
    };
    useEffect(() => {
        fetchLiked();
    }, [song.id]);

    const seek = (e: any) => {
        const percent = e.clientX / window.innerWidth;
        if (duration) {
            const time = duration * percent;
            const audioEle = document.querySelector('audio');
            audioEle && (audioEle.currentTime = time / 1000);
        }
    };

    const getPlayerLink = () => {
        return playList.link || '/';
    };

    const getPlaylistName = () => {
        return `🎉 ${playList.name}`;
    };

    if (!song.id) {
        return null;
    }

    const changeMode = () => {
        let index = MODES.indexOf(mode);
        if (++index > MODES.length) {
            index = 0;
        }
        setMode(MODES[index]);
        return;
    };

    const renderPlayMode = () => {
        if (mode === PlayMode.PLAYER_SHUFFLE) {
            return (
                <Tooltip title="随机播放">
                    <ShuffleTwoTone />
                </Tooltip>
            );
        }
        if (mode === PlayMode.PLAYER_REPEAT) {
            return (
                <Tooltip title="顺序播放">
                    <ReorderTwoTone />
                </Tooltip>
            );
        }
        if (mode === PlayMode.PLAYER_LOOP) {
            return (
                <Tooltip title="单曲循环">
                    <RepeatTwoTone />
                </Tooltip>
            );
        }
    };

    return (
        <div
            className={styles.container}
            ref={(ele) => {
                if (!ele) return;

                ele.style.backgroundColor = song.id ? 'none' : 'white';
            }}>
            {song.id ? (
                <figure
                    style={{
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        height: '100%',
                        width: '100%',
                        padding: 0,
                        margin: 0,
                        overflow: 'hidden',
                    }}>
                    <figcaption
                        style={{
                            position: 'absolute',
                            left: 0,
                            top: -470,
                            width: window.innerWidth,
                            height: window.innerWidth,
                            padding: 0,
                            margin: 0,
                            backgroundImage: `url(${`${song.album?.cover?.replace(/\?param=.*/, '')}?param=800y800`})`,
                            backgroundSize: `${window.innerWidth}px ${window.innerWidth}px`,
                            filter: 'blur(10px)',
                            zIndex: -1,
                        }}
                    />
                </figure>
            ) : (
                false
            )}
            <div id="progress" className={styles.bar} onClick={(e) => seek(e)}>
                <div className={styles.playing} />
                <div className={styles.buffering} />
            </div>
            <section>
                {/* Click the cover show the player screen */}
                <Link
                    data-text={getPlaylistName()}
                    className="tooltip"
                    style={{
                        display: 'flex',
                        height: 50,
                        width: 50,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                    to={getPlayerLink()}
                    onClick={(e) => {
                        if (e.currentTarget.href.endsWith('#/')) {
                            e.preventDefault();
                        }
                    }}>
                    <ProgressImage
                        {...{
                            height: 32,
                            width: 32,
                            src: song.album?.cover,
                            style: {
                                filter: `drop-shadow(3mm 2mm 4mm ${colors.randomColor()})`,
                            },
                            className: styles.cover,
                        }}
                    />
                </Link>

                <aside>
                    <div className={styles.info}>
                        <p className={styles.title} title={song.name}>
                            {/* Click the song name show the album screen */}
                            <Link to={song.album?.link || '#'}>{song.name}</Link>
                        </p>

                        <p className={styles.author}>
                            {song.artists &&
                                song.artists.map((e: IArtist, index: number) => {
                                    // Show the artist
                                    return (
                                        <Link key={index} to={e.link} title={e.name}>
                                            {e.name}
                                        </Link>
                                    );
                                })}
                        </p>
                    </div>

                    <div className={styles.action}>
                        {song.data && song.data.isFlac ? (
                            <span className={styles.highquality} title="High Quality Music">
                                SQ
                            </span>
                        ) : (
                            false
                        )}
                        <Link className={styles.text} to="/lyrics">
                            LRC
                        </Link>
                        <Link className={styles.text} to="/comments">
                            {helper.humanNumber(comments.total)} Comments
                        </Link>
                        <div className={styles.controls}>
                            <IconButton
                                onClick={() => {
                                    toggleLike({ id: song.id, like: !liked });
                                    fetchLiked();
                                }}>
                                {logined && liked ? (
                                    <FavoriteTwoTone className={classes.liked} />
                                ) : (
                                    <FavoriteBorderTwoTone />
                                )}
                            </IconButton>
                            <IconButton onClick={() => changeMode()}>{renderPlayMode()}</IconButton>
                            <IconButton>
                                <CloudDownloadTwoTone />
                            </IconButton>
                            <IconButton
                                onClick={() => {
                                    togglePrev(true);
                                }}>
                                <FastRewindTwoTone />
                            </IconButton>
                            <IconButton
                                onClick={() => {
                                    setPlaying(!playing);
                                }}>
                                {playing ? <PauseCircleOutlineTwoTone /> : <PlayCircleOutlineTwoTone />}
                            </IconButton>
                            <IconButton onClick={() => toggleNext(true)}>
                                <FastForwardTwoTone />
                            </IconButton>
                        </div>
                    </div>
                </aside>
            </section>
        </div>
    );
};

export default Controller;
