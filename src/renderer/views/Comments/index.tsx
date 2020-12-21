import { fetchListState } from '@/stores/comments';
import { songState } from '@/stores/controller';
import { ThumbUpAltTwoTone } from '@material-ui/icons';
import classnames from 'classnames';
import Header from 'components/Header';
import Hero from 'components/Hero';
import ProgressImage from 'components/ProgressImage';
import formatDistance from 'date-fns/formatDistance';
import React, { FC } from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import helper from 'utils/helper';
import styles from './index.less';

interface CommentsProps extends RouteComponentProps {}

const Comments: FC<CommentsProps> = (props) => {
    const controllerSong = useRecoilValue(songState);
    if (!controllerSong || !controllerSong.id) {
        props.history.replace('/');
    }
    const comments = useRecoilValue(fetchListState(controllerSong.id));
    const { hotList, newestList } = comments;
    const listRef = React.useRef<HTMLElement>();

    const loadmore = async () => {
        const container = listRef.current;

        // Drop the duplicate invoke
        if (container.classList.contains(styles.loadmore)) {
            return;
        }

        if (container.scrollTop + container.offsetHeight + 100 > container.scrollHeight) {
            // Mark as loading
            container.classList.add(styles.loadmore);
            await loadMore(controllerSong.id);
            container.classList.remove(styles.loadmore);
        }
    };

    const renderNestest = (list: any) => {
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
    };

    const renderComment = (key: any, item: any) => {
        return (
            <div key={key} className={styles.comment}>
                <Link className="tooltip" data-text={item.user.nickname} to={`/user/${item.user.userId}`}>
                    <ProgressImage
                        {...{
                            height: 48,
                            width: 48,
                            src: item.user.avatarUrl,
                        }}
                    />
                </Link>

                <aside>
                    <p>{item.content}</p>

                    <div className={styles.meta}>
                        <span
                            className={classnames('tooltip', styles.thumbsup, {
                                [styles.liked]: item.liked,
                            })}
                            data-text={`${helper.humanNumber(item.likedCount)} liked`}
                            onClick={() => like(item.commentId, !item.liked)}>
                            <ThumbUpAltTwoTone />
                        </span>

                        {formatDistance(item.time, new Date())}
                    </div>

                    {renderNestest(item.beReplied)}
                </aside>
            </div>
        );
    };

    const renderHotList = () => {
        return hotList.map((e: any, index: number) => {
            return renderComment(index, e);
        });
    };

    const renderNewestList = () => {
        return newestList.map((e: any, index: number) => {
            return renderComment(index, e);
        });
    };

    return (
        <div className={styles.container}>
            <Header transparent showBack />

            <Hero location={props.location} />

            <aside ref={listRef} className={styles.list} onScroll={loadmore}>
                <div className={styles.scroller}>
                    <div className={styles.hotList}>
                        <h3>Hot Comments</h3>
                        {renderHotList()}
                    </div>

                    <div className={styles.newestList}>
                        <h3>Newest Comments</h3>
                        {renderNewestList()}
                    </div>
                </div>
            </aside>
        </div>
    );
};

export default Comments;
