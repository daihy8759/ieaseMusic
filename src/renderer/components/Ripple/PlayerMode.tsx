import { Zoom } from '@material-ui/core';
import { ReorderTwoTone, RepeatTwoTone, ShuffleTwoTone } from '@material-ui/icons';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { useUpdateEffect } from 'react-use';
import styles from './index.module.less';
import { useStore } from '/@/context';
import { PLAYER_LOOP, PLAYER_REPEAT, PLAYER_SHUFFLE } from '/@/stores/controller';

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
            case PLAYER_SHUFFLE:
                return <ShuffleTwoTone />;

            case PLAYER_REPEAT:
                return <ReorderTwoTone />;

            case PLAYER_LOOP:
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
