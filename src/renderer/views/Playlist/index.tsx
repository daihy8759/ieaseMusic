import classnames from 'classnames';
import Controller from 'components/Controller';
import Header from 'components/Header';
import Loader from 'components/Loader';
import ProgressImage from 'components/ProgressImage';
import IStore from 'interface/IStore';
import { inject } from 'mobx-react';
import * as React from 'react';
import { Link } from 'react-router-dom';
import helper from 'utils/helper';
import * as styles from './index.less';

interface IPlaylistProps {
    match: any;
    getList: any;
    list: any;
    isPlaying: any;
    loading: boolean;
    types: any;
    loadmore: any;
}

@inject((stores: IStore) => ({
    loading: stores.playlist.loading,
    types: stores.playlist.types,
    list: stores.playlist.list,
    getList: stores.playlist.getList,
    loadmore: stores.playlist.loadmore,
    isPlaying: (id: number) => {
        return stores.controller.playlist.id === id;
    }
}))
class Playlist extends React.Component<IPlaylistProps, {}> {
    private listRef = React.createRef<HTMLElement>();

    componentDidMount() {
        this.loadList();
    }

    componentDidUpdate(prevProps: IPlaylistProps) {
        const { match } = this.props;
        if (match.params.type !== prevProps.match.params.type) {
            this.loadList();
        }
    }

    loadList = () => {
        const { match, getList } = this.props;
        getList(match.params.type);
    };

    async loadmore() {
        const container = this.listRef.current;
        const { loadmore } = this.props;

        // Drop the duplicate invoke
        if (container.classList.contains(styles.loadmore)) {
            return;
        }

        if (container.scrollTop + container.offsetHeight + 50 > container.scrollHeight) {
            // Mark as loading
            container.classList.add(styles.loadmore);

            await loadmore();
            container.classList.remove(styles.loadmore);
        }
    }

    renderList() {
        const { list, isPlaying } = this.props;

        return list.map((e: any, index: number) => {
            return (
                <article
                    className={classnames(styles.item, {
                        [styles.playing]: isPlaying(e.id)
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

                    <aside className={styles.info}>
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
            loading,
            types,
            match: { params },
            list
        } = this.props;

        return (
            <div className={styles.container} data-type={encodeURIComponent(params.type)}>
                <Header
                    {...{
                        transparent: true,
                        showBack: true
                    }}
                />

                <div className={styles.inner}>
                    <Loader show={loading} />

                    <ul className={styles.navs}>
                        {types.map((e: any) => {
                            const selected = params.type === e.name;
                            return (
                                <li
                                    key={e.name}
                                    className={classnames(styles.nav, {
                                        [styles.selected]: selected
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

                    <section className={styles.list} ref={this.listRef} onScroll={() => this.loadmore()}>
                        {this.renderList()}
                    </section>

                    <Controller />
                </div>
            </div>
        );
    }
}

export default Playlist;
