import React, { PureComponent } from 'react';
import injectSheet from 'react-jss';
import classnames from 'classnames';
import IndicatorClasses from './classes';

class Indicator extends PureComponent {
    render() {
        const { classes, className, style } = this.props;

        return (
            <div className={classnames(classes.container, className)} style={style}>
                <span />
                <span />
                <span />
                <span />
            </div>
        );
    }
}

export default injectSheet(IndicatorClasses)(Indicator);
