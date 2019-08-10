import { ipcRenderer } from 'electron';
import { inject } from 'mobx-react';
import React, { Component } from 'react';
import styles from './index.less';

@inject(stores => ({
    isMuted: () => stores.preferences.volume === 0
}))
class VolumeUpDown extends Component {
    state = {
        // true: up, false: down
        direction: true
    };

    constructor(props) {
        super(props);
        this.container = React.createRef();
    }

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
        this.container.current.classList.add(styles.animated);
    }

    animationDone() {
        this.container.current.classList.remove(styles.animated);
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
            <div className={styles.container} onAnimationEnd={() => this.animationDone()} ref={this.container}>
                {this.renderVolume()}
            </div>
        );
    }
}

export default VolumeUpDown;
