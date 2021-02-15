import React, { FC } from 'react';
import Indicator from '/@/components/Indicator';
import styles from '../index.module.less';

interface StatusProps {
    playing: boolean;
}

const Status: FC<StatusProps> = (props) => {
    const { playing } = props;

    if (!playing) {
        return null;
    }

    return (
        <div className={styles.status}>
            <Indicator />
        </div>
    );
};

export default Status;
