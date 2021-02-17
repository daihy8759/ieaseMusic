import { Zoom } from '@material-ui/core';
import { FastForwardTwoTone, FastRewindTwoTone } from '@material-ui/icons';
import React, { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import styles from './index.module.less';
import { PlayDirection, playDirectionState } from '/@/stores/controller';

const PlayerNavigation = () => {
    const playDirection = useRecoilValue(playDirectionState);
    const [zoom, setZoom] = useState(false);

    useEffect(() => {
        if (playDirection === PlayDirection.PREV || playDirection === PlayDirection.NEXT) {
            zoomTimeout();
        }
    }, [playDirection]);

    const zoomTimeout = () => {
        setZoom(true);
        setTimeout(() => {
            setZoom(false);
        }, 1000);
    };

    return (
        <Zoom in={zoom}>
            <div className={styles.container}>
                {playDirection === PlayDirection.PREV ? <FastRewindTwoTone /> : <FastForwardTwoTone />}
            </div>
        </Zoom>
    );
};

export default PlayerNavigation;
