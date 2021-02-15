import { Zoom } from '@material-ui/core';
import { ReorderTwoTone, RepeatTwoTone, ShuffleTwoTone } from '@material-ui/icons';
import React, { useState } from 'react';
import { useUpdateEffect } from 'react-use';
import { useRecoilValue } from 'recoil';
import { PlayMode } from '../../../shared/interface/controller';
import styles from './index.module.less';
import { playModeState } from '/@/stores/controller';

const PlayerMode = () => {
    const playMode = useRecoilValue(playModeState);
    const [zoom, setZoom] = useState(false);

    useUpdateEffect(() => {
        zoomTimeout();
    }, [playMode]);

    const zoomTimeout = () => {
        setZoom(true);
        setTimeout(() => {
            setZoom(false);
        }, 1000);
    };

    const renderIndicator = (mode: number) => {
        switch (mode) {
            case PlayMode.PLAYER_SHUFFLE:
                return <ShuffleTwoTone />;

            case PlayMode.PLAYER_REPEAT:
                return <ReorderTwoTone />;

            case PlayMode.PLAYER_LOOP:
                return <RepeatTwoTone />;

            default:
                return <></>;
        }
    };

    return (
        <Zoom in={zoom}>
            <div className={styles.container}>{renderIndicator(playMode)}</div>
        </Zoom>
    );
};

export default PlayerMode;
