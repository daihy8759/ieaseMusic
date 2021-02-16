import classnames from 'classnames';
import React, { useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import styles from './index.module.less';
import Playlist from './Playlist';
import PlaylistMeta from './PlaylistMeta';
import Search from './Search';
import Controller from '/@/components/Controller';
import FadeImage from '/@/components/FadeImage';
import Header from '/@/components/Header';
import ProgressImage from '/@/components/ProgressImage';
import IArtist from '/@/interface/IArtist';
import { songState } from '/@/stores/controller';
import { loginState } from '/@/stores/me';
import { fetchListDetailState, fetchRelatedState, playerKeywordState, playerSearchState } from '/@/stores/player';
import colors from '/@/utils/colors';

interface MatchParams {
    id: string;
    type: string;
}

const Player = () => {
    const { id, type }: MatchParams = useParams();
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
    const hasLogin = useRecoilValue(loginState);
    const { meta } = listDetail;
    const setKeywords = useSetRecoilState(playerKeywordState);
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

                    <PlaylistMeta meta={meta} />

                    <div className={classnames('space-x-1 space-y-1', styles.recommend)}>
                        <div
                            style={{
                                position: 'relative',
                                display: 'inline-block',
                                height: recommendHeight / 3,
                                width: recommendWidth / 3,
                            }}
                            className="ml-1">
                            {/* <div className={styles.play} onClick={() => play()}>
                                {canToggle() && playing ? <PauseSharp /> : <PlayArrowSharp />}
                            </div> */}
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
                        <ul ref={listRef}>
                            <Playlist />
                        </ul>
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
                        <ul ref={searchingRef}>
                            <Playlist />
                        </ul>
                    </div>
                </Search>
            </section>

            <Controller />
        </div>
    );
};

export default Player;
