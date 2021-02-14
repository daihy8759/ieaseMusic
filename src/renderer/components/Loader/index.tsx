import classnames from 'classnames';
import React from 'react';
import colors from '/@/utils/colors';
import styles from './index.module.less';

interface ILoaderProps {
    show?: boolean;
}

const Loader: React.SFC<ILoaderProps> = ({ show = false }) => {
    if (!show) {
        return null;
    }
    return (
        <div
            className={classnames(styles.container, {
                [styles.show]: show,
            })}>
            <div className={classnames(styles.loader, styles.animationLoader)}>
                <span
                    onAnimationIteration={(e: any) => {
                        e.target.style.backgroundColor = colors.randomColor();
                    }}
                    className={classnames(styles.inner, styles.animationInner)}
                />
            </div>
        </div>
    );
};

export default Loader;
