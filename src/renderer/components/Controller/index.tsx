import { useStore } from '@/context';
import classnames from 'classnames';
import ProgressImage from 'components/ProgressImage';
import IArtist from 'interface/IArtist';
import { observer } from 'mobx-react-lite';
import * as React from 'react';
import { Link } from 'react-router-dom';
import { PLAYER_LOOP, PLAYER_REPEAT, PLAYER_SHUFFLE } from 'stores/controller';
import colors from 'utils/colors';
import helper from 'utils/helper';
import * as styles from './index.less';

const Controller: React.FC = observer(() => {
    const { controller, me, comments } = useStore();

    const seek = (e: any) => {
        const percent = e.clientX / window.innerWidth;
        const {
            song: { duration }
        } = controller;
        const time = duration * percent;

        document.querySelector('audio').currentTime = time / 1000;
    };

    const getPlayerLink = () => {
        return controller.playlist.link || '/';
    };

    const getPlaylistName = () => {
        return `🎉 ${controller.playlist.name}`;
    };

    const { song, mode, prev, next, toggle, playing, changeMode } = controller;
    const { hasLogin, isLiked, like, unlike } = me;
    const { total: commentsTotal } = comments;
    const liked = isLiked(song.id);

    if (!song.id) {
        return null;
    }

    return (
        <div
            className={styles.container}
            ref={ele => {
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
                        overflow: 'hidden'
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
                            backgroundImage: `url(${`${song.album.cover.replace(/\?param=.*/, '')}?param=800y800`})`,
                            backgroundSize: `${window.innerWidth}px ${window.innerWidth}px`,
                            filter: 'blur(10px)',
                            zIndex: -1
                        }}
                    />
                </figure>
            ) : (
                false
            )}
            <div id="progress" className={styles.bar} onClick={e => seek(e)}>
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
                        alignItems: 'center'
                    }}
                    to={getPlayerLink()}
                    onClick={e => {
                        if (e.currentTarget.href.endsWith('#/')) {
                            e.preventDefault();
                        }
                    }}>
                    <ProgressImage
                        {...{
                            height: 32,
                            width: 32,
                            src: song.album.cover,
                            style: {
                                filter: `drop-shadow(3mm 2mm 4mm ${colors.randomColor()})`
                            },
                            className: styles.cover
                        }}
                    />
                </Link>

                <aside>
                    <div className={styles.info}>
                        <p className={styles.title} title={song.name}>
                            {/* Click the song name show the album screen */}
                            <Link to={song.album.link}>{song.name}</Link>
                        </p>

                        <p className={styles.author}>
                            {song.artists.map((e: IArtist, index: number) => {
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
                            {helper.humanNumber(commentsTotal)} Comments
                        </Link>

                        {hasLogin() && (
                            <i
                                className={classnames('remixicon-heart-2-fill', {
                                    [styles.liked]: liked
                                })}
                                onClick={e => (liked ? unlike(song) : like(song))}
                            />
                        )}

                        <i
                            className={classnames({
                                'remixicon-shuffle-fill': mode === PLAYER_SHUFFLE,
                                'remixicon-order-play-fill': mode === PLAYER_REPEAT,
                                'remixicon-repeat-fill': mode === PLAYER_LOOP
                            })}
                            onClick={_ => changeMode()}
                        />
                        <i className="remixicon-download-2-fill" onClick={prev} />

                        <div className={styles.controls}>
                            <i className="remixicon-rewind-fill" onClick={prev} />

                            <span className={styles.toggle} onClick={toggle}>
                                {playing ? (
                                    <i className="remixicon-pause-fill" />
                                ) : (
                                    <i
                                        className="remixicon-play-fill"
                                        style={{
                                            color: 'inherit'
                                        }}
                                    />
                                )}
                            </span>
                            <i
                                className="remixicon-speed-fill"
                                onClick={_ => next()}
                                style={{
                                    marginRight: 0
                                }}
                            />
                        </div>
                    </div>
                </aside>
            </section>
        </div>
    );
});

export default Controller;
