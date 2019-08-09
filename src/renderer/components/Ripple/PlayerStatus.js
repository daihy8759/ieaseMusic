import { inject, observer } from 'mobx-react';
import React, { Component } from 'react';
import injectSheet from 'react-jss';
import PlayerStatusClasses from './classes';

@inject(stores => ({
    playing: stores.controller.playing
}))
@observer
class PlayerStatus extends Component {
    constructor(props) {
        super(props);
        this.containerRef = React.createRef();
    }

    componentWillUpdate() {
        this.animationDone();
    }

    componentDidUpdate(prevProps) {
        const { classes, playing } = this.props;
        this.containerRef.current.classList.add(classes.animated);
        if (prevProps.playing !== playing) {
            this.animationDone();
        }
    }

    animationDone() {
        const { classes } = this.props;
        this.containerRef.current.classList.remove(classes.animated);
    }

    render() {
        const { classes, playing } = this.props;

        return (
            <div className={classes.container} onAnimationEnd={() => this.animationDone()} ref={this.containerRef}>
                {playing ? <i className="remixicon-play-fill" /> : <i className="remixicon-pause-fill" />}
            </div>
        );
    }
}

export default injectSheet(PlayerStatusClasses)(PlayerStatus);
