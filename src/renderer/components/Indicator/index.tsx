import classnames from 'classnames';
import * as React from 'react';
import * as styles from './index.less';

interface IIndicatorProps {
    className?: string;
    style?: any;
}

function Indicator({ className, style }: IIndicatorProps) {
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
