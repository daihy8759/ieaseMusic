import { Zoom } from '@material-ui/core';
import { PauseSharp, PlayArrowSharp } from '@material-ui/icons';
import React, { useState } from 'react';
import { useUpdateEffect } from 'react-use';
import { useRecoilValue } from 'recoil';
import styles from './index.module.less';
import { playingState } from '/@/stores/controller';

const PlayerStatus = () => {
    const playing = useRecoilValue(playingState);
    const [zoom, setZoom] = useState(false);

    useUpdateEffect(() => {
        zoomTimeout();
    }, [playing]);

    const zoomTimeout = () => {
        setZoom(true);
        setTimeout(() => {
            setZoom(false);
        }, 1000);
    };

    return (
        <Zoom in={zoom}>
            <div className={styles.container}>{playing ? <PlayArrowSharp /> : <PauseSharp />}</div>
        </Zoom>
    );
};

export default PlayerStatus;
