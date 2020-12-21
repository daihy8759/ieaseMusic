import { playingState } from '@/stores/controller';
import { Zoom } from '@material-ui/core';
import { PauseSharp, PlayArrowSharp } from '@material-ui/icons';
import * as React from 'react';
import { useUpdateEffect } from 'react-use';
import { useRecoilValue } from 'recoil';
import styles from './index.less';

const PlayerStatus: React.FC = () => {
    const playing = useRecoilValue(playingState);
    const [zoom, setZoom] = React.useState(false);

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
