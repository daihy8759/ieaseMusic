import { Fab } from '@material-ui/core';
import { PauseSharp, PlayArrowSharp } from '@material-ui/icons';
import React from 'react';
import { useParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import styles from './index.module.less';
import { fetchArtistState } from '/@/stores/artist';
import { playingState, playListState, songState, useTogglePlaying, useTogglePlayList } from '/@/stores/controller';

const PlayStatus = () => {
    const { id }: { id: string } = useParams();
    const playList = useRecoilValue(playListState);
    const playing = useRecoilValue(playingState);
    const song = useRecoilValue(songState);
    const togglePlay = useTogglePlaying();
    const togglePlayList = useTogglePlayList();
    const artist = useRecoilValue(fetchArtistState(parseInt(id)));

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

    const play = async () => {
        const isSameToPlaying = sameToPlaying();

        if (isSameToPlaying) {
            togglePlay();
        } else {
            togglePlayList({
                playList: {
                    id: artist.playlist.id,
                    link: `/artist/${artist.profile.id}`,
                    name: artist.playlist.name,
                    songs: artist.playlist.songs,
                },
            });
        }
    };

    return (
        <Fab onClick={play} className={styles.play}>
            {isPlaying() ? <PauseSharp /> : <PlayArrowSharp />}
        </Fab>
    );
};

export default PlayStatus;
