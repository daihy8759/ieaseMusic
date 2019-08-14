import { ipcRenderer } from 'electron';
import * as React from 'react';
import * as styles from './index.less';

class PlayerNavigation extends React.Component {
    state = {
        // true: prev, false: next
        direction: true
    };
    private containerRef = React.createRef<HTMLDivElement>();
    shouldUpdate: boolean;

    componentDidMount() {
        ipcRenderer.on('player-previous', () => {
            this.shouldUpdate = true;
            this.setState({
                direction: true
            });
        });

        ipcRenderer.on('player-next', () => {
            this.shouldUpdate = true;
            this.setState({
                direction: false
            });
        });
    }

    shouldComponentUpdate() {
        return !!this.shouldUpdate;
    }

    componentWillUpdate() {
        this.animationDone();
    }

    componentDidUpdate() {
        this.containerRef.current.classList.add(styles.animated);
    }

    animationDone() {
        this.shouldUpdate = false;
        this.containerRef.current.classList.remove(styles.animated);
    }

    render() {
        const { direction } = this.state;

        return (
            <div className={styles.container} onAnimationEnd={() => this.animationDone()} ref={this.containerRef}>
                {direction ? <i className="remixicon-rewind-fill" /> : <i className="remixicon-speed-fill" />}
            </div>
        );
    }
}

export default PlayerNavigation;
