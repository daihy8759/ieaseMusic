import React from 'react';
import styles from './index.less';

function Switch({ id, defaultChecked, onChange }) {
    return (
        <span className={styles.container}>
            <input defaultChecked={defaultChecked} id={id} type="checkbox" onChange={onChange} />
            <span className={styles.fake} />
        </span>
    );
}

export default Switch;
