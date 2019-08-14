import IStore from 'interface/IStore';
import { inject } from 'mobx-react';
import * as React from 'react';
import * as styles from './index.less';

interface IPlayerStatusProps {
    playing?: boolean;
}

@inject((stores: IStore) => ({
    playing: stores.controller.playing
}))
class PlayerStatus extends React.Component<IPlayerStatusProps, {}> {
    private containerRef = React.createRef<HTMLDivElement>();

    componentWillUpdate() {
        this.animationDone();
    }

    componentDidUpdate(prevProps: IPlayerStatusProps) {
        const { playing } = this.props;
        this.containerRef.current.classList.add(styles.animated);
        if (prevProps.playing !== playing) {
            this.animationDone();
        }
    }

    animationDone() {
        this.containerRef.current.classList.remove(styles.animated);
    }

    render() {
        const { playing } = this.props;

        return (
            <div className={styles.container} onAnimationEnd={() => this.animationDone()} ref={this.containerRef}>
                {playing ? <i className="remixicon-play-fill" /> : <i className="remixicon-pause-fill" />}
            </div>
        );
    }
}

export default PlayerStatus;
