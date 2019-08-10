import { inject } from 'mobx-react';
import React, { Component } from 'react';
import { PLAYER_LOOP, PLAYER_REPEAT, PLAYER_SHUFFLE } from 'stores/controller';
import styles from './index.less';

@inject(stores => ({
    mode: stores.controller.mode
}))
class PlayerMode extends Component {
    constructor(props) {
        super(props);
        this.containerRef = React.createRef();
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
        const { mode } = this.props;

        return (
            <div className={styles.container} onAnimationEnd={() => this.animationDone()} ref={this.containerRef}>
                {this.renderIndicator(mode)}
            </div>
        );
    }
}

export default PlayerMode;
