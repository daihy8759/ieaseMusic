import React, { useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import styles from './index.module.less';
import People from './People';
import Playlist from './Playlist';
import PlaylistMeta from './PlaylistMeta';
import Recommend from './Recommend';
import Search from './Search';
import Controller from '/@/components/Controller';
import Header from '/@/components/Header';
import ProgressImage from '/@/components/ProgressImage';
import { fetchListDetailState, playerKeywordState, playerSearchState } from '/@/stores/player';
import colors from '/@/utils/colors';

export interface MatchParams {
    id: string;
    type: string;
}

const Player = () => {
    const { id, type }: MatchParams = useParams();
    const [searching, setSearching] = useRecoilState(playerSearchState);
    const listDetail = useRecoilValue(fetchListDetailState({ id, type }));
    const { meta } = listDetail;
    const setKeywords = useSetRecoilState(playerKeywordState);
    const searchingRef = useRef<HTMLUListElement>(null);
    const listRef = useRef<HTMLUListElement>(null);

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

                    <Recommend />
                </div>

                <div className={styles.body}>
                    <div className={styles.people}>
                        <People />
                    </div>

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
