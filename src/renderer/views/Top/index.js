import classnames from 'classnames';
import Controller from 'components/Controller';
import Header from 'components/Header';
import Loader from 'components/Loader';
import ProgressImage from 'components/ProgressImage';
import formatDistance from 'date-fns/formatDistance';
import { inject } from 'mobx-react';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styles from './index.less';

@inject(stores => ({
    loading: stores.top.loading,
    list: stores.top.list,
    getList: stores.top.getList
}))
class Top extends Component {
    componentDidMount() {
        this.props.getList();
    }

    renderItem(item) {
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
                        src: item.cover
                    }}
                />

                <article className={styles.info}>
                    <p>{item.name}</p>

                    <div className={styles.line} />

                    <span>{formatDistance(item.updateTime, new Date())}</span>
                </article>
            </Link>
        );
    }

    renderList() {
        const { list } = this.props;
        const columns = [];

        for (let i = 0, length = Math.ceil(list.length / 2); i < length; ++i) {
            const item = list[i * 2];
            const next = list[i * 2 + 1];

            columns.push(
                <li key={i} className="clearfix">
                    {this.renderItem(item)}
                    {this.renderItem(next)}
                </li>
            );
        }

        return columns;
    }

    render() {
        const { loading } = this.props;

        if (loading) {
            return <Loader show />;
        }

        return (
            <div className={styles.container}>
                <Header
                    {...{
                        showBack: true,
                        transparent: true
                    }}
                />

                <ul className={styles.list}>{this.renderList()}</ul>

                <Controller />
            </div>
        );
    }
}

export default Top;
