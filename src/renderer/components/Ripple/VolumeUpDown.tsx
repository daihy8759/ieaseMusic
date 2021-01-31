import { volumeState } from '@/stores/preferences';
import { Zoom } from '@material-ui/core';
import { VolumeDownTwoTone, VolumeMuteTwoTone, VolumeUpTwoTone } from '@material-ui/icons';
import { ipcRenderer } from 'electron';
import React, { useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import styles from './index.less';

const VolumeUpDown = () => {
    const volume = useRecoilValue(volumeState);
    const isMuted = volume === 0;
    const containerRef = React.useRef<HTMLDivElement>();
    const [direction, setDirection] = React.useState(true);
    const [zoom, setZoom] = React.useState(false);

    useEffect(() => {
        ipcRenderer.on('player-volume-up', () => {
            setDirection(true);
            zoomTimeout();
        });

        ipcRenderer.on('player-volume-down', () => {
            setDirection(false);
            zoomTimeout();
        });
    }, []);

    const zoomTimeout = () => {
        setZoom(true);
        setTimeout(() => {
            setZoom(false);
        }, 1000);
    };

    const renderVolume = () => {
        if (isMuted) {
            return <VolumeMuteTwoTone />;
        }
        if (direction) {
            return <VolumeUpTwoTone />;
        }
        return <VolumeDownTwoTone />;
    };

    return (
        <Zoom in={zoom}>
            <div className={styles.container} ref={containerRef}>
                <Zoom in={true}>{renderVolume()}</Zoom>
            </div>
        </Zoom>
    );
};

export default VolumeUpDown;
