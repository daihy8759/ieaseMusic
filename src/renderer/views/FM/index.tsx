import { useStore } from '@/context';
import classnames from 'classnames';
import Controller from 'components/Controller';
import FadeImage from 'components/FadeImage';
import Header from 'components/Header';
import Loader from 'components/Loader';
import ProgressImage from 'components/ProgressImage';
import { observer } from 'mobx-react-lite';
import * as React from 'react';
import { Link } from 'react-router-dom';
import helper from 'utils/helper';
import * as styles from './index.less';
import { useEffectOnce } from 'react-use';
import { RouteChildrenProps } from 'react-router';

interface FMProps extends RouteChildrenProps {}

const FM: React.SFC<FMProps> = observer(props => {
    const { fm, me, comments, controller } = useStore();

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
                    showBack: true
                }}
            />
            {renderBg()}
            <section className={styles.main}>
                <article>
                    <ProgressImage
                        {...{
                            height: 290,
                            width: 290,
                            src: song.album.cover
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

                <div className={styles.bar} onClick={e => seek(e)}>
                    {isFMPlaying() && (
                        <div id="progress">
                            <div className={styles.playing} />
                            <div className={styles.buffering} />
                        </div>
                    )}
                </div>

                <div className={styles.controls}>
                    <i
                        className={classnames('remixicon-heart-fill', {
                            [styles.liked]: liked
                        })}
                        onClick={e => (liked ? unlike(song) : like(song))}
                    />

                    <i className="remixicon-arrow-down-circle-fill" onClick={e => ban(song.id)} />

                    <span onClick={e => play()}>
                        {isPlaying() ? <i className="remixicon-pause-fill" /> : <i className="remixicon-play-fill" />}
                    </span>

                    <i
                        className="remixicon-speed-fill"
                        onClick={next}
                        style={{
                            marginRight: 0
                        }}
                    />
                </div>
            </section>
        </div>
    );
});

export default FM;
