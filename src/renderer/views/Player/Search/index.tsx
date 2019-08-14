import closePng from 'assets/close.png';
import * as React from 'react';
import * as styles from './index.less';

interface ISearchProps {
    show?: boolean;
    close?: any;
    filter?: any;
}

class Search extends React.Component<ISearchProps, {}> {
    pressEscExit(e: any) {
        const { close } = this.props;
        if (e.keyCode === 27) {
            close();
        }
    }

    render() {
        const { show, close, filter, children } = this.props;

        if (!show) {
            return false;
        }

        return (
            <div className={styles.container} onKeyUp={e => this.pressEscExit(e)}>
                <header>
                    <input type="text" onInput={(e: any) => filter(e.target.value)} placeholder="Search..." />
                    <img alt="Close" className={styles.close} onClick={close} src={closePng} />
                </header>

                <div className={styles.list}>{children}</div>
            </div>
        );
    }
}

export default Search;
