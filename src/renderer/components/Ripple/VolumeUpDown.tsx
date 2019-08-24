import { useStore } from '@/context';
import { Zoom } from '@material-ui/core';
import { VolumeDownTwoTone, VolumeMuteTwoTone, VolumeUpTwoTone } from '@material-ui/icons';
import { ipcRenderer } from 'electron';
import { observer } from 'mobx-react-lite';
import * as React from 'react';
import { useEffectOnce } from 'react-use';
import * as styles from './index.less';

const VolumeUpDown: React.SFC = observer(() => {
    const {
        preferences: { volume }
    } = useStore();
    const isMuted = volume === 0;
    const containerRef = React.useRef<HTMLDivElement>();
    const [direction, setDirection] = React.useState(true);
    const [zoom, setZoom] = React.useState(false);

    useEffectOnce(() => {
        ipcRenderer.on('player-volume-up', () => {
            setDirection(true);
            zoomTimeout();
        });

        ipcRenderer.on('player-volume-down', () => {
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
