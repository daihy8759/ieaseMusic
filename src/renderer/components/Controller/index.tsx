import { IconButton } from '@material-ui/core';
import { CloudDownloadTwoTone, FastForwardTwoTone, FastRewindTwoTone } from '@material-ui/icons';
import React from 'react';
import { Link } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import styles from './index.module.less';
import LikeButton from './LikeButton';
import PlayingButton from './PlayingButton';
import PlayModeButton from './PlayModeButton';
import Progress from './Progress';
import ProgressImage from '/@/components/ProgressImage';
import IArtist from '/@/interface/IArtist';
import { totalCommentState } from '/@/stores/comments';
import { playListState, songState, useToggleNext, useTogglePrev } from '/@/stores/controller';
import colors from '/@/utils/colors';
import helper from '/@/utils/helper';

const Controller = () => {
    const song = useRecoilValue(songState);
    const playList = useRecoilValue(playListState);
    const toggleNext = useToggleNext();
    const togglePrev = useTogglePrev();
    const totalComment = useRecoilValue(totalCommentState(song.id));

    const getPlayerLink = () => {
        return playList.link || '/';
    };

    const getPlaylistName = () => {
        return `🎉 ${playList.name}`;
    };

    if (!song.id) {
        return null;
    }

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
            <Progress />
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
                            {helper.humanNumber(totalComment)} Comments
                        </Link>
                        <div className={styles.controls}>
                            <LikeButton />
                            <PlayModeButton />
                            <IconButton>
                                <CloudDownloadTwoTone />
                            </IconButton>
                            <IconButton onClick={togglePrev}>
                                <FastRewindTwoTone />
                            </IconButton>
                            <PlayingButton />
                            <IconButton onClick={toggleNext}>
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
