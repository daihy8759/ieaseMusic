import * as React from 'react';
import * as styles from './index.less';

interface ISwitchProps {
    id: string;
    defaultChecked: boolean;
    onChange?: any;
}

const Switch: React.SFC<ISwitchProps> = props => {
    const { id, defaultChecked, onChange } = props;
    return (
        <span className={styles.container}>
            <input defaultChecked={defaultChecked} id={id} type="checkbox" onChange={onChange} />
            <span className={styles.fake} />
        </span>
    );
};

export default Switch;
