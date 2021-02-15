import throttle from 'lodash.throttle';
import React, { FC, useEffect, useRef, useState } from 'react';
import styles from './index.module.less';
import closePng from '/@/assets/close.png';

interface ISearchProps {
    show?: boolean;
    close?: any;
    filter?: any;
}

const Search: FC<ISearchProps> = (props) => {
    const { show, close, filter, children } = props;
    const [keywords, setKeywords] = useState('');
    const throttled = useRef(throttle((newValue) => filter(newValue), 1000));
    useEffect(() => throttled.current(keywords), [keywords]);

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
                <input
                    type="text"
                    onChange={(e: any) => setKeywords(e.target.value)}
                    placeholder="Search..."
                    className="text-black"
                />
                <img alt="Close" className={styles.close} onClick={close} src={closePng} />
            </header>

            <div className={styles.list}>{children}</div>
        </div>
    );
};

export default Search;
