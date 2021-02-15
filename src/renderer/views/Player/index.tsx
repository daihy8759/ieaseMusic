import { PauseSharp, PlayArrowSharp } from '@material-ui/icons';
import classnames from 'classnames';
import React, { FC, useRef } from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import styles from './index.module.less';
import Search from './Search';
import Controller from '/@/components/Controller';
import FadeImage from '/@/components/FadeImage';
import Header from '/@/components/Header';
import ProgressImage from '/@/components/ProgressImage';
import IArtist from '/@/interface/IArtist';
import { playingState, playListState, songState, togglePlayListState, togglePlaySongState } from '/@/stores/controller';
import { loginState } from '/@/stores/me';
import {
    fetchListDetailState,
    fetchRelatedState,
    filterSongsState,
    playerKeywordState,
    playerSearchState,
} from '/@/stores/player';
import colors from '/@/utils/colors';
import helper from '/@/utils/helper';

interface MatchParams {
    id: string;
    type: string;
}

const Player: FC<RouteComponentProps<MatchParams>> = (props) => {
    const { id, type } = props.match.params;
    const song = useRecoilValue(songState);
    const related = useRecoilValue(
        fetchRelatedState({
            songId: song.id,
            artistId: song.artists ? song.artists[0].id : undefined,
        })
    );
    const { recommend, artists, users } = related;
    const [searching, setSearching] = useRecoilState(playerSearchState);
    const listDetail = useRecoilValue(fetchListDetailState({ id, type }));
    const togglePlaylist = useSetRecoilState(togglePlayListState);
    const togglePlaySong = useSetRecoilState(togglePlaySongState);
    const hasLogin = useRecoilValue(loginState);
    const { meta, songs } = listDetail;
    const [keywords, setKeywords] = useRecoilState(playerKeywordState);
    const filterSongs = useRecoilValue(
        filterSongsState({
            keywords,
            songs,
        })
    );
    const [playing, setPlaying] = useRecoilState(playingState);
    const playList = useRecoilValue(playListState);
    const searchingRef = useRef<HTMLUListElement>(null);
    const listRef = useRef<HTMLUListElement>(null);
    const recommendWidth = 260;
    const recommendHeight = 230;

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

    const play = async (songId?: number) => {
        const currentPlayId = playList.id;
        const sameToPlaying = currentPlayId && currentPlayId === meta.id;
        if (!songId) {
            if (sameToPlaying) {
                setPlaying(!playing);
            } else {
                togglePlaylist({
                    playList: {
                        id: meta.id,
                        link: `/player/${meta.type}/${meta.id}`,
                        name: meta.name,
                        songs,
                    },
                });
            }
            return;
        }

        if (sameToPlaying) {
            if (songId === song.id) {
                setPlaying(!playing);
                return;
            }
            togglePlaySong(songId);
            return;
        }
        togglePlaylist({
            playList: {
                id: meta.id,
                link: `/player/${meta.type}/${meta.id}`,
                name: meta.name,
                songs,
            },
        });
    };

    const renderList = () => {
        const sameToPlaylist = canToggle();
        const list = searching ? filterSongs : songs;

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

        return list.map((e, index: number) => {
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

                    <span className={styles.time}>{helper.getTime(e.duration || 0)}</span>
                </li>
            );
        });
    };

    return (
        <div className={styles.container}>
            <Header transparent />

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

                    <div className={classnames('space-x-1 space-y-1', styles.recommend)}>
                        <div
                            style={{
                                position: 'relative',
                                display: 'inline-block',
                                height: recommendHeight / 3,
                                width: recommendWidth / 3,
                            }}
                            className="ml-1">
                            <div className={styles.play} onClick={() => play()}>
                                {canToggle() && playing ? <PauseSharp /> : <PlayArrowSharp />}
                            </div>
                        </div>

                        {recommend.map((e: any, index: number) => {
                            return (
                                <Link className="clearfix" key={e.link + index} to={e.link}>
                                    <ProgressImage
                                        {...{
                                            height: recommendHeight / 3,
                                            width: recommendWidth / 3,
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
                            <span onClick={() => setSearching(true)}>Track/SEARCH</span>
                            <span>Time</span>
                        </header>
                        <ul ref={listRef}>{renderList()}</ul>
                    </div>
                </div>

                <Search
                    {...{
                        filter: setKeywords,
                        show: searching,
                        close: () => {
                            setSearching(false);
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
