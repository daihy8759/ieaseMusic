import { useStore } from '@/context';
import { ipcRenderer } from 'electron';
import { observer } from 'mobx-react-lite';
import * as React from 'react';
import { useEffectOnce, useUpdateEffect } from 'react-use';
import * as styles from './index.less';

const VolumeUpDown: React.SFC = observer(() => {
    const {
        preferences: { volume }
    } = useStore();
    const isMuted = volume === 0;
    const containerRef = React.useRef<HTMLDivElement>();
    const [direction, setDirection] = React.useState(true);

    useEffectOnce(() => {
        ipcRenderer.on('player-volume-up', () => {
            setDirection(true);
        });

        ipcRenderer.on('player-volume-down', () => {
            setDirection(false);
        });
    });

    useUpdateEffect(() => {
        containerRef.current.classList.add(styles.animated);
    }, [direction]);

    const animationDone = () => {
        containerRef.current.classList.remove(styles.animated);
    };

    const renderVolume = () => {
        if (isMuted) {
            return (
                <i
                    className="remixicon-volume-down-fill"
                    style={{
                        fontSize: 32
                    }}
                />
            );
        }
        if (direction) {
            return <i className="remixicon-volume-up-fill" />;
        }
        return <i className="remixicon-volume-down-fill" />;
    };

    return (
        <div className={styles.container} onAnimationEnd={() => animationDone()} ref={containerRef}>
            {renderVolume()}
        </div>
    );
});

export default VolumeUpDown;
