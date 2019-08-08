import { ipcRenderer } from 'electron';
import React, { Component } from 'react';
import injectSheet from 'react-jss';
import PlayerNavigationClasses from './classes';

class PlayerNavigation extends Component {
    state = {
        // true: prev, false: next
        direction: true
    };

    constructor(props) {
        super(props);
        this.containerRef = React.createRef();
    }

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
        const { classes } = this.props;
        this.containerRef.current.classList.add(classes.animated);
    }

    animationDone() {
        this.shouldUpdate = false;
        const { classes } = this.props;
        this.containerRef.current.classList.remove(classes.animated);
    }

    render() {
        const { classes } = this.props;
        const { direction } = this.state;

        return (
            <div className={classes.container} onAnimationEnd={() => this.animationDone()} ref={this.containerRef}>
                {direction ? <i className="remixicon-rewind-fill" /> : <i className="remixicon-speed-fill" />}
            </div>
        );
    }
}

export default injectSheet(PlayerNavigationClasses)(PlayerNavigation);
