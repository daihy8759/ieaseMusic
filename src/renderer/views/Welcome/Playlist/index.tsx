import { observer } from 'mobx-react-lite';
import React, { FC } from 'react';
import styles from '../index.module.less';
import Favorite from './Favorite';
import renderPlaylist from './Playlist';
import Recommend from './Recommend';
import { useStore } from '/@/context';
import { HomeData } from '/@/stores/home';

interface PlaylistProps {
    logined: boolean;
    currentPlaylistId?: string;
    play?: (playlist: HomeData) => void;
}

const Playlist: FC<PlaylistProps> = observer((props) => {
    const {
        home: { list },
    } = useStore();

    console.log(props);
    const { logined, currentPlaylistId, play } = props;

    if (list.length === 0) {
        return <div className={styles.placeholder} />;
    }

    const hasRecommend = logined && list.length > 1 && list[1].size;
    const playlist = logined ? list.slice(2, list.length) : list.slice();

    return (
        <section className={styles.list}>
            {logined && <Favorite favorite={list[0]} currentPlaylistId={currentPlaylistId} />}
            {hasRecommend && <Recommend recommend={list[1]} currentPlaylistId={currentPlaylistId} play={play} />}
            {renderPlaylist({ list: playlist, currentPlaylistId })}
        </section>
    );
});

export default Playlist;
