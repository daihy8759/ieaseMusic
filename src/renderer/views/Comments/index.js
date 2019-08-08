import classnames from 'classnames';
import Header from 'components/Header';
import Hero from 'components/Hero';
import Loader from 'components/Loader';
import ProgressImage from 'components/ProgressImage';
import formatDistance from 'date-fns/formatDistance';
import { inject, observer } from 'mobx-react';
import React, { Component } from 'react';
import injectSheet from 'react-jss';
import { Link } from 'react-router-dom';
import helper from 'utils/helper';
import CommentsClasses from './classes';

@inject(stores => ({
    loading: stores.comments.loading,
    hotList: stores.comments.hotList,
    newestList: stores.comments.newestList,
    thumbsup: stores.comments.like,
    getList: () => stores.comments.getList(Object.assign({}, stores.controller.song)),
    loadMore: stores.comments.loadMore,
    song: stores.comments.song
}))
@observer
class Comments extends Component {
    componentWillMount() {
        const { getList } = this.props;
        getList();
    }

    loadmore = async () => {
        const container = this.list;
        const { classes, song, loadMore } = this.props;

        // Drop the duplicate invoke
        if (container.classList.contains(classes.loadmore)) {
            return;
        }

        if (container.scrollTop + container.offsetHeight + 100 > container.scrollHeight) {
            // Mark as loading
            container.classList.add(classes.loadmore);
            await loadMore(song.id);
            container.classList.remove(classes.loadmore);
        }
    };

    renderNestest(list) {
        const { classes } = this.props;

        if (!list.length) {
            return false;
        }

        return (
            <ul className={classes.nestest}>
                {list.map((e, index) => {
                    return (
                        <li key={index}>
                            <Link to={`/user/${e.user.userId}`}>{e.user.nickname}</Link>：<span>{e.content}</span>
                        </li>
                    );
                })}
            </ul>
        );
    }

    renderComment(key, item) {
        const { classes, thumbsup } = this.props;

        return (
            <div key={key} className={classes.comment}>
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

                    <div className={classes.meta}>
                        <span
                            className={classnames('tooltip', classes.thumbsup, {
                                [classes.liked]: item.liked
                            })}
                            data-text={`${helper.humanNumber(item.likedCount)} liked`}
                            onClick={ev => thumbsup(item.commentId, !item.liked)}>
                            <i className="ion-thumbsup" />
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
        return hotList.map((e, index) => {
            return this.renderComment(index, e);
        });
    }

    renderNewestList() {
        const { newestList } = this.props;
        return newestList.map((e, index) => {
            return this.renderComment(index, e);
        });
    }

    render() {
        const { classes, loading, song, location } = this.props;

        if (loading || !song.id) {
            return <Loader show />;
        }

        return (
            <div className={classes.container}>
                <Header transparent showBack />

                <Hero location={location} />

                <aside
                    ref={ele => {
                        this.list = ele;
                    }}
                    className={classes.list}
                    onScroll={e => this.loadmore()}>
                    <div className={classes.scroller}>
                        <div className={classes.hotList}>
                            <h3>Hot Comments</h3>
                            {this.renderHotList()}
                        </div>

                        <div className={classes.newestList}>
                            <h3>Newest Comments</h3>
                            {this.renderNewestList()}
                        </div>
                    </div>
                </aside>
            </div>
        );
    }
}

export default injectSheet(CommentsClasses)(Comments);
