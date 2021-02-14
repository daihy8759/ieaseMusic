import { Zoom } from '@material-ui/core';
import { VolumeDownTwoTone, VolumeMuteTwoTone, VolumeUpTwoTone } from '@material-ui/icons';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { useEffectOnce } from 'react-use';
import styles from './index.module.less';
import { useStore } from '/@/context';
import { useIpc } from '/@/hooks';

const ipc = useIpc();

const VolumeUpDown = observer(() => {
    const {
        preferences: { volume },
    } = useStore();
    const isMuted = volume === 0;
    const containerRef = React.useRef<HTMLDivElement>();
    const [direction, setDirection] = React.useState(true);
    const [zoom, setZoom] = React.useState(false);

    useEffectOnce(() => {
        // TODO ipc.on
        // ipc.on('player-volume-up', () => {
        //     setDirection(true);
        //     zoomTimeout();
        // });
        // ipc.on('player-volume-down', () => {
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
});

export default VolumeUpDown;
