import classnames from 'classnames';
import React from 'react';
import styles from './index.less';

function Indicator({ className, style }) {
    return (
        <div className={classnames(styles.container, className)} style={style}>
            <span />
            <span />
            <span />
            <span />
        </div>
    );
}

export default Indicator;
