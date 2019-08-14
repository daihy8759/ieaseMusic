import * as React from 'react';
import * as styles from './index.less';

interface ISwitchProps {
    id: string;
    defaultChecked: boolean;
    onChange?: any;
}

function Switch({ id, defaultChecked, onChange }: ISwitchProps) {
    return (
        <span className={styles.container}>
            <input defaultChecked={defaultChecked} id={id} type="checkbox" onChange={onChange} />
            <span className={styles.fake} />
        </span>
    );
}

export default Switch;
