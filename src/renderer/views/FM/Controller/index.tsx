import { IconButton } from '@material-ui/core';
import { red } from '@material-ui/core/colors';
import {
    CloudDownloadTwoTone,
    DeleteForeverTwoTone,
    FastForwardTwoTone,
    FavoriteBorderTwoTone,
    FavoriteTwoTone,
    PauseCircleOutlineTwoTone,
    PlayCircleOutlineTwoTone,
} from '@material-ui/icons';
import { makeStyles } from '@material-ui/styles';
import React from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { playingState, playListState, songState, useToggleNext } from '/@/stores/controller';
import { fetchFmListState } from '/@/stores/fm';
import { likedState, useToggleLike } from '/@/stores/me';

const useStyles = makeStyles({
    liked: {
        color: red[900],
        textShadow: `0 0 24px ${red[900]}`,
    },
});

const Controller = () => {
    const classes = useStyles();
    const song = useRecoilValue(songState);
    const liked = useRecoilValue(likedState);
    const toggleLike = useToggleLike();
    const toggleNext = useToggleNext();
    const [playing, setPlaying] = useRecoilState(playingState);
    const playList = useRecoilValue(playListState);
    const fmPlayList = useRecoilValue(fetchFmListState);

    const isPlaying = () => {
        return playing && playList.id === fmPlayList.id;
    };

    return (
        <div>
            <IconButton
                onClick={() => {
                    toggleLike({ id: song.id, like: !liked });
                }}>
                {liked ? <FavoriteTwoTone className={classes.liked} /> : <FavoriteBorderTwoTone />}
            </IconButton>
            <IconButton onClick={() => ban(song.id)}>
                <DeleteForeverTwoTone />
            </IconButton>
            <IconButton>
                <CloudDownloadTwoTone />
            </IconButton>
            <IconButton onClick={() => setPlaying(!playing)}>
                {isPlaying() ? <PauseCircleOutlineTwoTone /> : <PlayCircleOutlineTwoTone />}
            </IconButton>
            <IconButton onClick={toggleNext}>
                <FastForwardTwoTone />
            </IconButton>
        </div>
    );
};

export default Controller;
