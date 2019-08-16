import { useStore } from '@/context';
import { observer } from 'mobx-react-lite';
import * as React from 'react';
import { useUpdateEffect } from 'react-use';
import * as styles from './index.less';

const PlayerStatus: React.SFC = observer(() => {
    const {
        controller: { playing }
    } = useStore();

    const containerRef = React.useRef<HTMLDivElement>();

    const animationDone = () => {
        containerRef.current.classList.remove(styles.animated);
    };

    useUpdateEffect(() => {
        containerRef.current.classList.add(styles.animated);
        animationDone();
    }, [playing]);

    return (
        <div className={styles.container} onAnimationEnd={animationDone} ref={containerRef}>
            {playing ? <i className="remixicon-play-fill" /> : <i className="remixicon-pause-fill" />}
        </div>
    );
});

export default PlayerStatus;
