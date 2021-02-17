import { PauseSharp, PlayArrowSharp } from '@material-ui/icons';
import classnames from 'classnames';
import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import styles from './index.module.less';
import ISong from '/@/interface/ISong';
import { fetchArtistState } from '/@/stores/artist';
import {
    playingState,
    playListState,
    songState,
    useTogglePlaying,
    useTogglePlayList,
    useToggleSong,
} from '/@/stores/controller';
import helper from '/@/utils/helper';

const Songs = () => {
    const { id }: { id: string } = useParams();
    const playList = useRecoilValue(playListState);
    const playing = useRecoilValue(playingState);
    const song = useRecoilValue(songState);
    const togglePlayList = useTogglePlayList();
    const togglePlay = useTogglePlaying();
    const togglePlaySong = useToggleSong();
    const artist = useRecoilValue(fetchArtistState(parseInt(id)));
    const { playlist } = artist;

    const sameToPlaying = () => {
        return playList.id === artist.playlist.id;
    };

    const isPlaying = (id?: number) => {
        let res = playing && playList.id === artist.playlist.id;

        if (res && id) {
            res = song.id === id;
        }
        return res;
    };

    const play = async (songId?: number) => {
        const isSameToPlaying = sameToPlaying();

        if (isSameToPlaying) {
            if (playing && song.id === songId) {
                togglePlay();
            } else {
                togglePlaySong(songId);
            }
        } else {
            togglePlayList({
                playList: {
                    id: artist.playlist.id,
                    link: `/artist/${artist.profile.id}`,
                    name: artist.playlist.name,
                    songs: artist.playlist.songs,
                },
                songId,
            });
        }
    };
    return (
        <ul className={styles.songs}>
            {playlist.songs &&
                playlist.songs.map((e: ISong, index: number) => {
                    const album = e.album;
                    return (
                        <li
                            className={classnames({
                                [styles.playing]: sameToPlaying() && song.id === e.id,
                            })}
                            key={e.id}
                            onClick={() => play(e.id)}>
                            {isPlaying(e.id) ? <PauseSharp /> : <PlayArrowSharp />}

                            <span data-index>{index}</span>

                            <span data-name title={e.name}>
                                {e.name}
                            </span>

                            <span data-album title={album?.name}>
                                <Link to={`/player/1/${album?.id}`}>{album?.name}</Link>
                            </span>

                            <span data-time>{helper.getTime(e.duration || 0)}</span>
                        </li>
                    );
                })}
        </ul>
    );
};

export default Songs;
