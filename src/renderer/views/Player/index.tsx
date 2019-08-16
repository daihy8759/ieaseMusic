import { useStore } from '@/context';
import classnames from 'classnames';
import Controller from 'components/Controller';
import FadeImage from 'components/FadeImage';
import Header from 'components/Header';
import Loader from 'components/Loader';
import ProgressImage from 'components/ProgressImage';
import IArtist from 'interface/IArtist';
import { observer } from 'mobx-react-lite';
import * as React from 'react';
import { Link } from 'react-router-dom';
import { useEffectOnce, useUpdateEffect } from 'react-use';
import colors from 'utils/colors';
import helper from 'utils/helper';
import * as styles from './index.less';
import Search from './Search';

interface IPlayerProps {
    match: any;
}

const Player: React.FC<IPlayerProps> = observer(props => {
    const { player, controller, me } = useStore();
    const { song, playing } = controller;
    const searchingRef = React.useRef<HTMLUListElement>();
    const listRef = React.useRef<HTMLUListElement>();

    const showLoading = () => {
        player.toggleLoading(true);
    };

    const hideLoading = () => {
        setTimeout(() => player.toggleLoading(false), 500);
    };

    const getList = async (args: any) => {
        const { id, type } = args;
        await player.getDetail(type, id);
    };

    const load = async () => {
        const { getRelated } = player;
        const { song } = controller;
        const {
            match: { params }
        } = props;

        showLoading();
        await getList(params);
        await getRelated(song);
        hideLoading();
    };

    useEffectOnce(() => {
        load();
    });

    useUpdateEffect(() => {
        player.getRelated(song);
    }, [song.id]);

    useUpdateEffect(() => {
        load();
    }, [props.match.params.id]);

    useUpdateEffect(() => {
        const { searching } = player;
        const ele = searching ? searchingRef.current : listRef.current;
        if (!ele) {
            return;
        }
        const playing = ele.querySelector(styles.active);

        if (playing) {
            playing.scrollIntoViewIfNeeded();
        }
    }, [playing]);

    const renderPeople = () => {
        const { artists, users } = player;
        const { hasLogin } = me;
        const content = [];

        if (!hasLogin()) {
            return <div className={styles.nothing}>Nothing ...</div>;
        }

        if (users.length) {
            content.push(
                <div className={styles.users} key="users">
                    <h3>Listening history</h3>
                    {users.map((e: any, index: number) => {
                        return (
                            <Link className="clearfix tooltip" data-text={e.name} key={e.name + index} to={e.link}>
                                <FadeImage src={e.avatar} title={e.name} />
                            </Link>
                        );
                    })}
                </div>
            );
        }

        content.push(
            <div className={styles.artists} key="artists">
                <h3>Similar artist</h3>
                {artists.slice(0, content.length ? 5 : 10).map((e: IArtist, index: number) => {
                    return (
                        <Link className="clearfix tooltip" data-text={e.name} key={e.name + index} to={e.link}>
                            <FadeImage src={e.avatar} title={e.name} />
                        </Link>
                    );
                })}
            </div>
        );

        return content;
    };

    const canToggle = () => {
        return controller.playlist.id === player.meta.id;
    };

    const play = async (songid?: number) => {
        const { meta } = player;
        const currentPlayId = controller.playlist.id;
        const sameToPlaying = currentPlayId && currentPlayId === player.meta.id;

        if (!songid) {
            // Change the
            if (sameToPlaying) {
                controller.toggle();
            } else {
                // Play a new playlist
                controller.setup({
                    id: meta.id,
                    link: `/player/${meta.type}/${meta.id}`,
                    name: meta.name,
                    songs: player.songs
                });
                await controller.play();
            }

            return;
        }

        if (sameToPlaying) {
            // Song is playing
            if (songid === controller.song.id) {
                controller.toggle();
                return;
            }

            await controller.play(songid);
            return;
        }

        // Change playlist and play specific song
        controller.setup({
            id: meta.id,
            link: `/player/${meta.type}/${meta.id}`,
            name: meta.name,
            songs: player.songs
        });
        await controller.play(songid);
    };

    const canifav = () => {
        return player.meta.type === 0 && me.likes.get('id') !== player.meta.id;
    };

    const renderList = () => {
        const { songs, keywords, searching, filtered } = player;
        const { song } = controller;
        const sameToPlaylist = canToggle();
        const list = searching && keywords ? filtered : songs;

        if (list.length === 0) {
            return (
                <div
                    className={styles.nothing}
                    style={{
                        height: '100%'
                    }}>
                    Nothing ...
                </div>
            );
        }

        return list.map((e, index: number) => {
            return (
                <li
                    key={e.id}
                    className={classnames({
                        [styles.active]: sameToPlaylist && e.id === song.id
                    })}
                    onClick={async () => {
                        await play(e.id);
                    }}>
                    {sameToPlaylist && e.id === song.id ? (
                        <i className={playing ? 'remixicon-pause-fill' : 'remixicon-play-fill'} />
                    ) : (
                        <i className="remixicon-play-fill" />
                    )}

                    <span className={styles.index}>{index}</span>

                    <span className={styles.name} title={e.name}>
                        {e.name}
                    </span>

                    <span className={styles.time}>{helper.getTime(e.duration)}</span>
                </li>
            );
        });
    };

    const { loading, meta, recommend, filter, searching } = player;

    return (
        <div className={styles.container}>
            <Loader show={loading} />

            <Header transparent showFav={canifav()} />

            <section>
                <div
                    className={styles.hero}
                    style={{
                        backgroundImage: colors.randomGradient()
                    }}>
                    <ProgressImage
                        {...{
                            height: 260,
                            width: 260,
                            src: meta.cover
                        }}
                    />

                    <summary className={styles.summary}>
                        <p className={styles.title}>
                            <span>{meta.name}</span>
                        </p>

                        <p className={styles.author}>
                            <span>
                                {meta.author.map((e: any, index: number) => {
                                    return (
                                        <Link key={e.name + index} to={e.link}>
                                            {e.name}
                                        </Link>
                                    );
                                })}
                            </span>
                        </p>

                        <p
                            className={styles.subtitle}
                            style={{
                                marginTop: 20
                            }}>
                            <span>{meta.company || `${helper.humanNumber(meta.played)} Played`}</span>
                        </p>
                    </summary>

                    <div className={styles.recommend}>
                        <div
                            style={{
                                position: 'relative',
                                display: 'inline-block',
                                height: 260 / 3,
                                width: 260 / 3,
                                marginTop: -2
                            }}>
                            <div className={styles.play} onClick={() => play()}>
                                {canToggle() && playing ? (
                                    <i className="remixicon-pause-fill" />
                                ) : (
                                    <i className="remixicon-play-fill" />
                                )}
                            </div>
                        </div>

                        {recommend.map((e: any, index: number) => {
                            return (
                                <Link className="clearfix" key={e.link + index} to={e.link}>
                                    <ProgressImage
                                        {...{
                                            height: 260 / 3,
                                            width: 260 / 3,
                                            src: e.cover
                                        }}
                                    />
                                </Link>
                            );
                        })}
                    </div>
                </div>

                <div className={styles.body}>
                    <div className={styles.people}>{renderPeople()}</div>

                    <div className={styles.list}>
                        <header>
                            <span onClick={() => player.toggleSearch(true)}>Track/SEARCH</span>
                            <span>Time</span>
                        </header>
                        <ul ref={listRef}>{renderList()}</ul>
                    </div>
                </div>

                <Search
                    {...{
                        filter,
                        show: searching,
                        close: () => {
                            player.toggleSearch(false);
                            filter();
                        }
                    }}>
                    <div className={styles.list}>
                        <ul ref={searchingRef}>{renderList()}</ul>
                    </div>
                </Search>
            </section>

            <Controller />
        </div>
    );
});

export default Player;
