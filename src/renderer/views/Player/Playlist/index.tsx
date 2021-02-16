import { PauseSharp, PlayArrowSharp } from '@material-ui/icons';
import classnames from 'classnames';
import React from 'react';
import { useParams } from 'react-router-dom';
import { constSelector, useRecoilState, useRecoilValue } from 'recoil';
import styles from './index.module.less';
import { playingState, playListState, songState, useTogglePlayList, useToggleSong } from '/@/stores/controller';
import { fetchListDetailState, filterSongsState, playerKeywordState, playerSearchState } from '/@/stores/player';
import helper from '/@/utils/helper';

interface MatchParams {
    id: string;
    type: string;
}

const Playlist = () => {
    const { id, type }: MatchParams = useParams();
    const listDetail = useRecoilValue(fetchListDetailState({ id, type }));
    const playList = useRecoilValue(playListState);
    const [playing, setPlaying] = useRecoilState(playingState);
    const searching = useRecoilValue(playerSearchState);
    const keywords = useRecoilValue(playerKeywordState);
    const { meta, songs } = listDetail;
    const filterSongs = useRecoilValue(
        searching
            ? // @ts-ignore
              filterSongsState({
                  keywords,
                  songs,
              })
            : constSelector(null)
    );
    const song = useRecoilValue(songState);
    const togglePlaylist = useTogglePlayList();
    const togglePlaySong = useToggleSong();

    const canToggle = () => {
        return playList.id === meta.id;
    };
    const sameToPlaylist = canToggle();
    const list = searching ? filterSongs : songs;

    if (!list || list.length === 0) {
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
            songId,
        });
    };

    return (
        <>
            {list.map((e, index: number) => {
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
            })}
        </>
    );
};

export default Playlist;
