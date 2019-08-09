import { ipcRenderer } from 'electron';
import { inject } from 'mobx-react';
import React, { Component } from 'react';
import injectSheet from 'react-jss';
import VolumeUpDownClasses from './classes';

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
        const {
            classes: { animated }
        } = this.props;
        this.container.current.classList.add(animated);
    }

    animationDone() {
        const {
            classes: { animated }
        } = this.props;
        this.container.current.classList.remove(animated);
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
        const { classes } = this.props;

        return (
            <div className={classes.container} onAnimationEnd={() => this.animationDone()} ref={this.container}>
                {this.renderVolume()}
            </div>
        );
    }
}

export default injectSheet(VolumeUpDownClasses)(VolumeUpDown);
