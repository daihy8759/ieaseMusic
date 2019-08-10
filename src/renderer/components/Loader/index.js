import classnames from 'classnames';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import colors from 'utils/colors';
import styles from './index.less';

class Loader extends PureComponent {
    static propTypes = {
        show: PropTypes.bool
    };

    static defaultProps = {
        show: false
    };

    render() {
        const { show } = this.props;
        return (
            <div
                className={classnames(styles.container, {
                    [styles.show]: show
                })}>
                <div className={classnames(styles.loader, styles.animationLoader)}>
                    <span
                        onAnimationIteration={e => {
                            e.target.style.backgroundColor = colors.randomColor();
                        }}
                        className={classnames(styles.inner, styles.animationInner)}
                    />
                </div>
            </div>
        );
    }
}

export default Loader;
