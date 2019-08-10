import React, { PureComponent } from 'react';
import styles from './index.less';

class Switch extends PureComponent {
    render() {
        const { id, defaultChecked, onChange } = this.props;

        return (
            <span className={styles.container}>
                <input defaultChecked={defaultChecked} id={id} type="checkbox" onChange={onChange} />
                <span className={styles.fake} />
            </span>
        );
    }
}

export default Switch;
