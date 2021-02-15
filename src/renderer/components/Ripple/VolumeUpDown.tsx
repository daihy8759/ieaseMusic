import { Zoom } from '@material-ui/core';
import { VolumeDownTwoTone, VolumeMuteTwoTone, VolumeUpTwoTone } from '@material-ui/icons';
import React, { useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import { IPC_PLAYER_VOLUME_DOWN, IPC_PLAYER_VOLUME_UP } from '../../../shared/ipc';
import styles from './index.module.less';
import { useChannel } from '/@/hooks';
import { volumeState } from '/@/stores/preferences';

const channel = useChannel();

const VolumeUpDown = () => {
    const volume = useRecoilValue(volumeState);
    const isMuted = volume === 0;
    const containerRef = React.useRef<HTMLDivElement>(null);
    const [direction, setDirection] = React.useState(true);
    const [zoom, setZoom] = React.useState(false);

    useEffect(() => {
        channel.listen(IPC_PLAYER_VOLUME_UP, () => {
            setDirection(true);
            zoomTimeout();
        });
        channel.listen(IPC_PLAYER_VOLUME_DOWN, () => {
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
