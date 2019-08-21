import { useStore } from '@/context';
import { observer } from 'mobx-react-lite';
import * as React from 'react';
import { useUpdateEffect } from 'react-use';
import { PLAYER_LOOP, PLAYER_REPEAT, PLAYER_SHUFFLE } from 'stores/controller';
import * as styles from './index.less';

const PlayerMode: React.SFC = observer(() => {
    const {
        controller: { mode }
    } = useStore();
    const containerRef = React.useRef<HTMLDivElement>();

    useUpdateEffect(() => {
        containerRef.current.classList.add(styles.animated);
    }, [mode]);

    const animationDone = () => {
        containerRef.current.classList.remove(styles.animated);
    };

    const renderIndicator = (mode: number) => {
        switch (mode) {
            case PLAYER_SHUFFLE:
                return <i className="remixicon-shuffle-fill" />;

            case PLAYER_REPEAT:
                return <i className="remixicon-order-play-fill" />;

            case PLAYER_LOOP:
                return <i className="remixicon-repeat-fill" />;

            default:
                return <></>;
        }
    };

    return (
        <div className={styles.container} onAnimationEnd={() => animationDone()} ref={containerRef}>
            {renderIndicator(mode)}
        </div>
    );
});

export default PlayerMode;
