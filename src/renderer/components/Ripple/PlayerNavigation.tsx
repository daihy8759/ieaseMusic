import { ipcRenderer } from 'electron';
import * as React from 'react';
import { useEffectOnce } from 'react-use';
import * as styles from './index.less';

const PlayerNavigation: React.FC = () => {
    const [direction, setDirection] = React.useState(true);
    const containerRef = React.useRef<HTMLDivElement>();

    useEffectOnce(() => {
        ipcRenderer.on('player-previous', () => {
            setDirection(true);
        });
        ipcRenderer.on('player-next', () => {
            setDirection(false);
        });
    });

    const animationDone = () => {
        containerRef.current.classList.remove(styles.animated);
    };

    return (
        <div className={styles.container} onAnimationEnd={animationDone} ref={containerRef}>
            {direction ? <i className="remixicon-rewind-fill" /> : <i className="remixicon-speed-fill" />}
        </div>
    );
};

export default PlayerNavigation;
