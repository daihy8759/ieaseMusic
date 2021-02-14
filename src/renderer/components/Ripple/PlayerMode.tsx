import { Zoom } from '@material-ui/core';
import { ReorderTwoTone, RepeatTwoTone, ShuffleTwoTone } from '@material-ui/icons';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { useUpdateEffect } from 'react-use';
import { PlayMode } from '../../../shared/interface/controller';
import styles from './index.module.less';
import { useStore } from '/@/context';

const PlayerMode = observer(() => {
    const {
        controller: { mode },
    } = useStore();
    const [zoom, setZoom] = React.useState(false);

    useUpdateEffect(() => {
        zoomTimeout();
    }, [mode]);

    const zoomTimeout = () => {
        setZoom(true);
        setTimeout(() => {
            setZoom(false);
        }, 1000);
    };

    const renderIndicator = (mode: number) => {
        switch (mode) {
            case PlayMode.PLAYER_SHUFFLE:
                return <ShuffleTwoTone />;

            case PlayMode.PLAYER_REPEAT:
                return <ReorderTwoTone />;

            case PlayMode.PLAYER_LOOP:
                return <RepeatTwoTone />;

            default:
                return <></>;
        }
    };

    return (
        <Zoom in={zoom}>
            <div className={styles.container}>{renderIndicator(mode)}</div>
        </Zoom>
    );
});

export default PlayerMode;
