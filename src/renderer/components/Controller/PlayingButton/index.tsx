import { IconButton } from '@material-ui/core';
import { PauseCircleOutlineTwoTone, PlayCircleOutlineTwoTone } from '@material-ui/icons';
import React from 'react';
import { useRecoilState } from 'recoil';
import { playingState } from '/@/stores/controller';

const PlayingButton = () => {
    const [playing, setPlaying] = useRecoilState(playingState);

    return (
        <IconButton
            onClick={() => {
                setPlaying(!playing);
            }}>
            {playing ? <PauseCircleOutlineTwoTone /> : <PlayCircleOutlineTwoTone />}
        </IconButton>
    );
};

export default PlayingButton;
