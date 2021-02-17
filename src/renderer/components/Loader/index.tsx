import classnames from 'classnames';
import React, { FC } from 'react';
import styles from './index.module.less';
import colors from '/@/utils/colors';

interface LoaderProps {
    show?: boolean;
}

const Loader: FC<LoaderProps> = ({ show = false }) => {
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
