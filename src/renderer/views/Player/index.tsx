import ISong from '@/interface/ISong';
import {
    playingState,
    playListState,
    songState,
    togglePlayListState,
    togglePlaySongState,
    togglePlayState,
} from '@/stores/controller';
import { isLiked, loginState } from '@/stores/me';
import { fetchListDetailState, fetchRelatedState, filterSongsState } from '@/stores/player';
import { PauseSharp, PlayArrowSharp } from '@material-ui/icons';
import classnames from 'classnames';
import Controller from 'components/Controller';
import FadeImage from 'components/FadeImage';
import Header from 'components/Header';
import ProgressImage from 'components/ProgressImage';
import IArtist from 'interface/IArtist';
import React, { FC, useState } from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { useUpdateEffect } from 'react-use';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import colors from 'utils/colors';
import helper from 'utils/helper';
import Search from '../Search';
import styles from './index.less';

interface MatchParams {
    id: string;
}

const Player: FC<RouteComponentProps<MatchParams>> = (props) => {
    const {
        match: { params },
    } = props;
    const listDetail = useRecoilValue(fetchListDetailState(params));
    const song = useRecoilValue(songState);
    if (!song || !song.id) {
        props.history.replace('/');
        return null;
    }
    const related = useRecoilValue(
        fetchRelatedState({
            songId: song.id,
            artistId: song.artists.length > 0 ? song.artists[0].id : 0,
        })
    );
    const { recommend, users, artists } = related;
    const playList = useRecoilValue(playListState);
    const { meta, songs } = listDetail;
    const playing = useRecoilValue(playingState);
    const hasLogin = useRecoilValue(loginState);
    const togglePlay = useSetRecoilState(togglePlayState);
    const togglePlaySong = useSetRecoilState(togglePlaySongState);
    const togglePlayList = useSetRecoilState(togglePlayListState);
    const filterSongs = useSetRecoilState(filterSongsState);
    const searchingRef = React.useRef<HTMLUListElement>();
    const listRef = React.useRef<HTMLUListElement>();
    const [searching, setSearching] = useState(false);
    const [filteredSongs, setFilteredSongs] = useState<ISong[]>([]);

    useUpdateEffect(() => {
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
        const content = [];

        if (!hasLogin) {
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
        return playList.id === meta.id;
    };

    const play = async (songid?: number) => {
        const currentPlayId = playList.id;
        const sameToPlaying = currentPlayId && currentPlayId === meta.id;

        if (!songid) {
            if (sameToPlaying) {
                togglePlay();
            } else {
                togglePlayList({
                    playList: {
                        id: meta.id,
                        link: `/player/${meta.type}/${meta.id}`,
                        name: meta.name,
                        songs: listDetail.songs,
                    },
                });
            }
            return;
        }

        if (sameToPlaying) {
            // Song is playing
            if (songid === song.id) {
                togglePlay();
                return;
            }

            togglePlaySong(songid);
            return;
        }

        // Change playlist and play specific song
        togglePlayList({
            playList: {
                id: meta.id,
                link: `/player/${meta.type}/${meta.id}`,
                name: meta.name,
                songs: listDetail.songs,
            },
            songId: songid,
        });
    };

    const canifav = () => {
        return meta.type === 0 && isLiked(meta.id);
    };

    const renderList = () => {
        const sameToPlaylist = canToggle();
        const list = searching && keywords ? filtered : songs;

        if (list.length === 0) {
            return (
                <div
                    className={styles.nothing}
                    style={{
                        height: '100%',
                    }}>
                    Nothing ...
                </div>
            );
        }

        return list.map((e: ISong, index: number) => {
            return (
                <li
                    key={e.id}
                    className={classnames({
                        [styles.active]: sameToPlaylist && e.id === song.id,
                    })}
                    onClick={async () => {
                        await play(e.id);
                    }}>
                    {sameToPlaylist && e.id === song.id ? (
                        playing ? (
                            <PauseSharp />
                        ) : (
                            <PlayArrowSharp />
                        )
                    ) : (
                        <PlayArrowSharp />
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

    return (
        <div className={styles.container}>
            <Header transparent showFav={canifav()} />

            <section>
                <div
                    className={styles.hero}
                    style={{
                        backgroundImage: colors.randomGradient(),
                    }}>
                    <ProgressImage
                        {...{
                            height: 260,
                            width: 260,
                            src: meta.cover,
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
                                marginTop: 20,
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
                                marginTop: -2,
                            }}>
                            <div className={styles.play} onClick={() => play()}>
                                {canToggle() && playing ? <PauseSharp /> : <PlayArrowSharp />}
                            </div>
                        </div>

                        {recommend.map((e: any, index: number) => {
                            return (
                                <Link className="clearfix" key={e.link + index} to={e.link}>
                                    <ProgressImage
                                        {...{
                                            height: 260 / 3,
                                            width: 260 / 3,
                                            src: e.cover,
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
                            {/* <span onClick={() => player.toggleSearch(true)}>Track/SEARCH</span> */}
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
                            // player.toggleSearch(false);
                            // filter();
                        },
                    }}>
                    <div className={styles.list}>
                        <ul ref={searchingRef}>{renderList()}</ul>
                    </div>
                </Search>
            </section>

            <Controller />
        </div>
    );
};

export default Player;
