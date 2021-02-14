import { useStore } from '/@/context';
import classnames from 'classnames';
import Controller from '/@/components/Controller';
import Header from '/@/components/Header';
import Loader from '/@/components/Loader';
import ProgressImage from '/@/components/ProgressImage';
import formatDistance from 'date-fns/formatDistance';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { Link } from 'react-router-dom';
import { useEffectOnce } from 'react-use';
import styles from './index.module.less';

const Top = observer(() => {
    const { top } = useStore();
    const { loading } = top;

    useEffectOnce(() => {
        top.getList();
    });

    if (loading) {
        return <Loader show />;
    }

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
        const { list } = top;
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
});

export default Top;
