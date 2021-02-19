import React, { useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import Controller from './Controller';
import styles from './index.module.less';
import FadeImage from '/@/components/FadeImage';
import Header from '/@/components/Header';
import ProgressImage from '/@/components/ProgressImage';
import { totalCommentState } from '/@/stores/comments';
import { playListState, songState, useTogglePlayList } from '/@/stores/controller';
import { fetchFmListState } from '/@/stores/fm';
import { loginState } from '/@/stores/me';
import helper from '/@/utils/helper';

const FM = () => {
    const history = useHistory();
    const hasLogin = useRecoilValue(loginState);
    const playList = useRecoilValue(playListState);
    const togglePlaylist = useTogglePlayList();
    const fmPlayList = useRecoilValue(fetchFmListState);
    const songs = fmPlayList.songs || [];
    const song = useRecoilValue(songState);
    const totalComment = useRecoilValue(totalCommentState(song.id));

    useEffect(() => {
        if (!hasLogin) {
            history.replace('/login/1');
            return;
        }
        togglePlaylist({ playList: fmPlayList });
    }, []);

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
                                    {helper.humanNumber(totalComment)} Comments
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

                <Controller />
            </section>
        </div>
    );
};

export default FM;
