import classnames from 'classnames';
import Header from 'components/Header';
import Hero from 'components/Hero';
import Loader from 'components/Loader';
import ProgressImage from 'components/ProgressImage';
import formatDistance from 'date-fns/formatDistance';
import ISong from 'interface/ISong';
import IStore from 'interface/IStore';
import { inject } from 'mobx-react';
import * as React from 'react';
import { Link } from 'react-router-dom';
import helper from 'utils/helper';
import * as styles from './index.less';

interface ICommentsProps {
    getList: any;
    newestList: any;
    hotList: any;
    location: any;
    loading: boolean;
    song: ISong;
    loadMore: any;
    thumbsup: any;
}

@inject((stores: IStore) => ({
    loading: stores.comments.loading,
    hotList: stores.comments.hotList,
    newestList: stores.comments.newestList,
    thumbsup: stores.comments.like,
    getList: () => stores.comments.getList(Object.assign({}, stores.controller.song)),
    loadMore: stores.comments.loadMore,
    song: stores.comments.song
}))
class Comments extends React.Component<ICommentsProps, {}> {
    private list = React.createRef<HTMLDivElement>();

    componentDidMount() {
        this.props.getList();
    }

    loadmore = async () => {
        const container = this.list.current;
        const { song, loadMore } = this.props;

        // Drop the duplicate invoke
        if (container.classList.contains(styles.loadmore)) {
            return;
        }

        if (container.scrollTop + container.offsetHeight + 100 > container.scrollHeight) {
            // Mark as loading
            container.classList.add(styles.loadmore);
            await loadMore(song.id);
            container.classList.remove(styles.loadmore);
        }
    };

    renderNestest(list: any) {
        if (!list.length) {
            return false;
        }

        return (
            <ul className={styles.nestest}>
                {list.map((e: any, index: number) => {
                    return (
                        <li key={index}>
                            <Link to={`/user/${e.user.userId}`}>{e.user.nickname}</Link>：<span>{e.content}</span>
                        </li>
                    );
                })}
            </ul>
        );
    }

    renderComment(key: any, item: any) {
        const { thumbsup } = this.props;

        return (
            <div key={key} className={styles.comment}>
                <Link className="tooltip" data-text={item.user.nickname} to={`/user/${item.user.userId}`}>
                    <ProgressImage
                        {...{
                            height: 48,
                            width: 48,
                            src: item.user.avatarUrl
                        }}
                    />
                </Link>

                <aside>
                    <p>{item.content}</p>

                    <div className={styles.meta}>
                        <span
                            className={classnames('tooltip', styles.thumbsup, {
                                [styles.liked]: item.liked
                            })}
                            data-text={`${helper.humanNumber(item.likedCount)} liked`}
                            onClick={ev => thumbsup(item.commentId, !item.liked)}>
                            <i className="remixicon-thumb-up-fill" />
                        </span>

                        {formatDistance(item.time, new Date())}
                    </div>

                    {this.renderNestest(item.beReplied)}
                </aside>
            </div>
        );
    }

    renderHotList() {
        const { hotList } = this.props;
        return hotList.map((e: any, index: number) => {
            return this.renderComment(index, e);
        });
    }

    renderNewestList() {
        const { newestList } = this.props;
        return newestList.map((e: any, index: number) => {
            return this.renderComment(index, e);
        });
    }

    render() {
        const { loading, song, location } = this.props;

        if (loading || !song.id) {
            return <Loader show />;
        }

        return (
            <div className={styles.container}>
                <Header transparent showBack />

                <Hero location={location} />

                <aside ref={this.list} className={styles.list} onScroll={e => this.loadmore()}>
                    <div className={styles.scroller}>
                        <div className={styles.hotList}>
                            <h3>Hot Comments</h3>
                            {this.renderHotList()}
                        </div>

                        <div className={styles.newestList}>
                            <h3>Newest Comments</h3>
                            {this.renderNewestList()}
                        </div>
                    </div>
                </aside>
            </div>
        );
    }
}

export default Comments;