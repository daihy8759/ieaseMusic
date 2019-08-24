import { Zoom } from '@material-ui/core';
import { FastForwardTwoTone, FastRewindTwoTone } from '@material-ui/icons';
import { ipcRenderer } from 'electron';
import * as React from 'react';
import { useEffectOnce } from 'react-use';
import * as styles from './index.less';

const PlayerNavigation: React.FC = () => {
    const [direction, setDirection] = React.useState(true);
    const [zoom, setZoom] = React.useState(false);

    useEffectOnce(() => {
        ipcRenderer.on('player-previous', () => {
            setDirection(true);
            zoomTimeout();
        });
        ipcRenderer.on('player-next', () => {
            setDirection(false);
            zoomTimeout();
        });
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
