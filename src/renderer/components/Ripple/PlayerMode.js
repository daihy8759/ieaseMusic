import { inject, observer } from 'mobx-react';
import React, { Component } from 'react';
import injectSheet from 'react-jss';
import { PLAYER_LOOP, PLAYER_REPEAT, PLAYER_SHUFFLE } from 'stores/controller';
import PlayerModeClasses from './classes';

@inject(stores => ({
    mode: stores.controller.mode
}))
@observer
class PlayerMode extends Component {
    constructor(props) {
        super(props);
        this.containerRef = React.createRef();
    }

    componentWillUpdate() {
        this.animationDone();
    }

    componentDidUpdate() {
        const { classes } = this.props;
        this.containerRef.current.classList.add(classes.animated);
    }

    animationDone() {
        const { classes } = this.props;
        this.containerRef.current.classList.remove(classes.animated);
    }

    renderIndicator(mode) {
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
    }

    render() {
        const { classes, mode } = this.props;

        return (
            <div className={classes.container} onAnimationEnd={() => this.animationDone()} ref={this.containerRef}>
                {this.renderIndicator(mode)}
            </div>
        );
    }
}

export default injectSheet(PlayerModeClasses)(PlayerMode);
