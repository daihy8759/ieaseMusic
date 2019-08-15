import * as closePng from 'assets/close.png';
import { observer } from 'mobx-react-lite';
import * as React from 'react';
import * as styles from './index.less';

interface ISearchProps {
    show?: boolean;
    close?: any;
    filter?: any;
}

const Search: React.SFC<ISearchProps> = observer(props => {
    const { show, close, filter, children } = props;

    if (!show) {
        return null;
    }

    const pressEscExit = (e: any) => {
        if (e.keyCode === 27) {
            close();
        }
    };

    return (
        <div className={styles.container} onKeyUp={pressEscExit}>
            <header>
                <input type="text" onInput={(e: any) => filter(e.target.value)} placeholder="Search..." />
                <img alt="Close" className={styles.close} onClick={close} src={closePng} />
            </header>

            <div className={styles.list}>{children}</div>
        </div>
    );
});

export default Search;
