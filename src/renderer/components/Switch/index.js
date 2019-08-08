import React, { PureComponent } from 'react';
import injectSheet from 'react-jss';
import SwitchClasses from './classes';

class Switch extends PureComponent {
    render() {
        const { classes, id, defaultChecked, onChange } = this.props;

        return (
            <span className={classes.container}>
                <input defaultChecked={defaultChecked} id={id} type="checkbox" onChange={onChange} />
                <span className={classes.fake} />
            </span>
        );
    }
}

export default injectSheet(SwitchClasses)(Switch);
