import { Zoom } from '@material-ui/core';
import { FastForwardTwoTone, FastRewindTwoTone } from '@material-ui/icons';
import React from 'react';
import { useEffectOnce } from 'react-use';
import styles from './index.module.less';

const PlayerNavigation: React.FC = () => {
    const [direction, setDirection] = React.useState(true);
    const [zoom, setZoom] = React.useState(false);

    useEffectOnce(() => {
        // TODO ipc.on
        // ipc.on('player-previous', () => {
        //     setDirection(true);
        //     zoomTimeout();
        // });
        // ipc.on('player-next', () => {
        //     setDirection(false);
        //     zoomTimeout();
        // });
    });

    const zoomTimeout = () => {
        setZoom(true);
        setTimeout(() => {
            setZoom(false);
        }, 1000);
    };

    return (
        <Zoom in={zoom}>
            <div className={styles.container}>{direction ? <FastRewindTwoTone /> : <FastForwardTwoTone />}</div>
        </Zoom>
    );
};

export default PlayerNavigation;
