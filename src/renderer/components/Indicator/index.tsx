import classnames from 'classnames';
import React from 'react';
import styles from './index.module.less';

interface IIndicatorProps {
    className?: string;
    style?: any;
}

const Indicator: React.SFC<IIndicatorProps> = (props) => {
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
