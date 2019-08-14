import { ipcRenderer } from 'electron';
import IStore from 'interface/IStore';
import { inject } from 'mobx-react';
import * as React from 'react';
import * as styles from './index.less';

interface IVolumeUpDownProps {
    isMuted?: any;
}

@inject((stores: IStore) => ({
    isMuted: () => stores.preferences.volume === 0
}))
class VolumeUpDown extends React.Component<IVolumeUpDownProps, {}> {
    state = {
        // true: up, false: down
        direction: true
    };
    private containerRef = React.createRef<HTMLDivElement>();

    componentDidMount() {
        ipcRenderer.on('player-volume-up', () => {
            this.setState({
                direction: true
            });
        });

        ipcRenderer.on('player-volume-down', () => {
            this.setState({
                direction: false
            });
        });
    }

    componentWillUpdate() {
        this.animationDone();
    }

    componentDidUpdate() {
        this.containerRef.current.classList.add(styles.animated);
    }

    animationDone() {
        this.containerRef.current.classList.remove(styles.animated);
    }

    renderVolume() {
        const { isMuted } = this.props;
        if (isMuted()) {
            return (
                <i
                    className="remixicon-volume-down-fill"
                    style={{
                        fontSize: 32
                    }}
                />
            );
        }
        const { direction } = this.state;
        if (direction) {
            return <i className="remixicon-volume-up-fill" />;
        }
        return <i className="remixicon-volume-down-fill" />;
    }

    render() {
        return (
            <div className={styles.container} onAnimationEnd={() => this.animationDone()} ref={this.containerRef}>
                {this.renderVolume()}
            </div>
        );
    }
}

export default VolumeUpDown;
