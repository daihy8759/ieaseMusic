import { useStore } from '@/context';
import { PauseCircleOutlineTwoTone, PlayCircleOutlineTwoTone } from '@material-ui/icons';
import { observer } from 'mobx-react-lite';
import * as React from 'react';
import { useUpdateEffect } from 'react-use';
import * as styles from './index.less';

const PlayerStatus: React.FC = observer(() => {
    const {
        controller: { playing }
    } = useStore();

    const containerRef = React.useRef<HTMLDivElement>();

    const animationDone = () => {
        containerRef.current.classList.remove(styles.animated);
    };

    useUpdateEffect(() => {
        containerRef.current.classList.add(styles.animated);
        setTimeout(() => {
            animationDone();
        }, 1000);
    }, [playing]);

    return (
        <div className={styles.container} onAnimationEnd={animationDone} ref={containerRef}>
            {playing ? <PlayCircleOutlineTwoTone /> : <PauseCircleOutlineTwoTone />}
        </div>
    );
});

export default PlayerStatus;
