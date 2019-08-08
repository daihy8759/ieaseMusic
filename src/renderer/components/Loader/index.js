import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import injectSheet from 'react-jss';
import colors from 'utils/colors';
import LoaderClasses from './classes';

class Loader extends PureComponent {
    static propTypes = {
        show: PropTypes.bool
    };

    static defaultProps = {
        show: false
    };

    render() {
        const { classes, show } = this.props;
        return (
            <div
                className={classnames(classes.container, {
                    [classes.show]: show
                })}>
                <div className={classnames(classes.loader, classes.animationLoader)}>
                    <span
                        onAnimationIteration={e => {
                            e.target.style.backgroundColor = colors.randomColor();
                        }}
                        className={classnames(classes.inner, classes.animationInner)}
                    />
                </div>
            </div>
        );
    }
}

export default injectSheet(LoaderClasses)(Loader);
