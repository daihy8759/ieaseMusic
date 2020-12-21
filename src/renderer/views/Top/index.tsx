import { fetchListState } from '@/stores/top';
import classnames from 'classnames';
import Controller from 'components/Controller';
import Header from 'components/Header';
import ProgressImage from 'components/ProgressImage';
import formatDistance from 'date-fns/formatDistance';
import * as React from 'react';
import { Link } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import styles from './index.less';

const Top = () => {
    const list = useRecoilValue(fetchListState);

    const renderItem = (item: any) => {
        if (!item) {
            return false;
        }

        const height = (window.innerHeight - 50) / 2;

        return (
            <Link className={classnames('clearfix', styles.item)} to={item.link}>
                <ProgressImage
                    {...{
                        height,
                        width: height,
                        src: item.cover,
                    }}
                />

                <article className={styles.info}>
                    <p>{item.name}</p>

                    <div className={styles.line} />

                    <span>{formatDistance(item.updateTime, new Date())}</span>
                </article>
            </Link>
        );
    };

    const renderList = () => {
        const columns = [];

        for (let i = 0, length = Math.ceil(list.length / 2); i < length; ++i) {
            const item = list[i * 2];
            const next = list[i * 2 + 1];

            columns.push(
                <li key={i} className="clearfix">
                    {renderItem(item)}
                    {renderItem(next)}
                </li>
            );
        }
        return columns;
    };

    return (
        <div className={styles.container}>
            <Header
                {...{
                    showBack: true,
                    transparent: true,
                }}
            />

            <ul className={styles.list}>{renderList()}</ul>

            <Controller />
        </div>
    );
};

export default Top;
