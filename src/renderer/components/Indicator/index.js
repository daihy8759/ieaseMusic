import classnames from 'classnames';
import React, { PureComponent } from 'react';
import styles from './index.less';

class Indicator extends PureComponent {
    render() {
        const { className, style } = this.props;

        return (
            <div className={classnames(styles.container, className)} style={style}>
                <span />
                <span />
                <span />
                <span />
            </div>
        );
    }
}

export default Indicator;
