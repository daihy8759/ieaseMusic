import classnames from 'classnames';
import formatDistance from 'date-fns/formatDistance';
import React from 'react';
import { Link } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import styles from './index.module.less';
import Controller from '/@/components/Controller';
import Header from '/@/components/Header';
import ProgressImage from '/@/components/ProgressImage';
import { fetchListState } from '/@/stores/top';

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

                <article className={classnames('space-y-4', styles.info)}>
                    <p>{item.name}</p>
                    <div className={styles.line} />
                    <div>{formatDistance(item.updateTime, new Date())}</div>
                </article>
            </Link>
        );
    };

    const renderList = () => {
        const columns = [];
        const listLen = list.length;
        const listRaw = list.slice();

        for (let i = 0, length = Math.ceil(listLen / 2); i < length; ++i) {
            const pos = i * 2;
            if (listLen < pos) {
                break;
            }
            const item = listRaw[pos];
            const next = listLen >= pos + 1 ? listRaw[pos + 1] : null;

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
