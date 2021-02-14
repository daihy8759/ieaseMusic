import { useStore } from '/@/context';
import { Zoom } from '@material-ui/core';
import { PauseSharp, PlayArrowSharp } from '@material-ui/icons';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { useUpdateEffect } from 'react-use';
import styles from './index.module.less';

const PlayerStatus: React.FC = observer(() => {
    const {
        controller: { playing },
    } = useStore();
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
});

export default PlayerStatus;
