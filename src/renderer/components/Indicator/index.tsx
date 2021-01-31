import classnames from 'classnames';
import * as React from 'react';
import styles from './index.less';

interface IIndicatorProps {
    className?: string;
    style?: any;
}

const Indicator: React.SFC<IIndicatorProps> = props => {
    const { className, style } = props;
    return (
        <div className={classnames(styles.container, className)} style={style}>
            <span />
            <span />
            <span />
            <span />
        </div>
    );
};

export default Indicator;
