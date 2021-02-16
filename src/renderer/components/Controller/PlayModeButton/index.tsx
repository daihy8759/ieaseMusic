import { IconButton, Tooltip } from '@material-ui/core';
import { ReorderTwoTone, RepeatTwoTone, ShuffleTwoTone } from '@material-ui/icons';
import React from 'react';
import { useRecoilState } from 'recoil';
import { PlayMode } from '../../../../shared/interface/controller';
import { playModeState, PLAY_MODES } from '/@/stores/controller';

const PlayModeButton = () => {
    const [mode, setMode] = useRecoilState(playModeState);

    const changeMode = () => {
        const index = PLAY_MODES.indexOf(mode);
        if (index + 1 >= PLAY_MODES.length) {
            setMode(PlayMode.PLAYER_SHUFFLE);
        } else {
            setMode(PLAY_MODES[index + 1]);
        }
    };

    const renderPlayMode = () => {
        if (mode === PlayMode.PLAYER_SHUFFLE) {
            return (
                <Tooltip title="随机播放">
                    <ShuffleTwoTone />
                </Tooltip>
            );
        }
        if (mode === PlayMode.PLAYER_REPEAT) {
            return (
                <Tooltip title="顺序播放">
                    <ReorderTwoTone />
                </Tooltip>
            );
        }
        if (mode === PlayMode.PLAYER_LOOP) {
            return (
                <Tooltip title="单曲循环">
                    <RepeatTwoTone />
                </Tooltip>
            );
        }
    };
    return (
        <>
            <IconButton onClick={changeMode}>{renderPlayMode()}</IconButton>
        </>
    );
};

export default PlayModeButton;
