import { inject } from 'mobx-react';
import React, { Component } from 'react';
import styles from './index.less';

@inject(stores => ({
    playing: stores.controller.playing
}))
class PlayerStatus extends Component {
    constructor(props) {
        super(props);
        this.containerRef = React.createRef();
    }

    componentWillUpdate() {
        this.animationDone();
    }

    componentDidUpdate(prevProps) {
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
