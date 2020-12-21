import * as React from 'react';
import { useNetwork } from 'react-use';
import styles from './index.less';

interface IOfflineProps {
    show?: boolean;
}

const Offline: React.FC<IOfflineProps> = ({ show = false }) => {
    if (!show) {
        return null;
    }
    const networkState = useNetwork();
    if (networkState.online) {
        return null;
    }
    return (
        <div className={styles.container}>
            <h1>Opps, seems like you are offline...</h1>
        </div>
    );
};

export default Offline;
