import classnames from 'classnames';
import Controller from 'components/Controller';
import Header from 'components/Header';
import Loader from 'components/Loader';
import ProgressImage from 'components/ProgressImage';
import { inject } from 'mobx-react';
import React, { Component } from 'react';
import injectSheet from 'react-jss';
import { Link } from 'react-router-dom';
import helper from 'utils/helper';
import PlaylistClasses from './classes';

@inject(stores => ({
    loading: stores.playlist.loading,
    types: stores.playlist.types,
    list: stores.playlist.list,
    getList: stores.playlist.getList,
    loadmore: stores.playlist.loadmore,
    isPlaying: id => {
        return stores.controller.playlist.id === id;
    }
}))
class Playlist extends Component {
    componentDidUpdate(prevProps) {
        const { match, getList } = this.props;
        if (match.params.type !== prevProps.match.params.type) {
            getList(encodeURIComponent(match.params.type));
        }
    }

    async loadmore(e) {
        const container = this.list;
        const { classes, loadmore } = this.props;

        // Drop the duplicate invoke
        if (container.classList.contains(classes.loadmore)) {
            return;
        }

        if (container.scrollTop + container.offsetHeight + 50 > container.scrollHeight) {
            // Mark as loading
            container.classList.add(classes.loadmore);

            await loadmore();
            container.classList.remove(classes.loadmore);
        }
    }

    renderList() {
        const { classes, list, isPlaying } = this.props;

        return list.map((e, index) => {
            return (
                <article
                    className={classnames(classes.item, {
                        [classes.playing]: isPlaying(e.id)
                    })}
                    key={index}>
                    <Link to={e.link}>
                        <ProgressImage
                            {...{
                                height: 64,
                                width: 64,
                                src: e.cover
                            }}
                        />
                    </Link>

                    <aside className={classes.info}>
                        <p title={e.name}>{e.name}</p>
                        <p>
                            <Link to={e.user.link}>{e.user.name}</Link>
                        </p>
                        <span>{helper.humanNumber(e.played)} Played</span>
                    </aside>
                </article>
            );
        });
    }

    render() {
        const {
            classes,
            loading,
            types,
            match: { params },
            list
        } = this.props;

        return (
            <div className={classes.container} data-type={encodeURIComponent(params.type)}>
                <Header
                    {...{
                        transparent: true,
                        showBack: true
                    }}
                />

                <div className={classes.inner}>
                    <Loader show={loading} />

                    <ul className={classes.navs}>
                        {types.map(e => {
                            const selected = params.type === e.name;

                            return (
                                <li
                                    key={e.name}
                                    className={classnames(classes.nav, {
                                        [classes.selected]: selected
                                    })}>
                                    {selected ? (
                                        <Link to={`/playlist/${encodeURIComponent(e.name)}`}>
                                            {e.name} / {list.length} LIST
                                        </Link>
                                    ) : (
                                        <Link to={`/playlist/${encodeURIComponent(e.name)}`}>{e.name}</Link>
                                    )}
                                </li>
                            );
                        })}
                    </ul>

                    <section
                        className={classes.list}
                        ref={ele => {
                            this.list = ele;
                        }}
                        onScroll={e => this.loadmore()}>
                        {this.renderList()}
                    </section>

                    <Controller />
                </div>
            </div>
        );
    }
}

export default injectSheet(PlaylistClasses)(Playlist);
