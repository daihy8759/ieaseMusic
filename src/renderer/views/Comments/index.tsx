import { ThumbUpAltTwoTone } from '@material-ui/icons';
import classnames from 'classnames';
import formatDistance from 'date-fns/formatDistance';
import React, { useEffect, useRef } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import styles from './index.module.less';
import { MusicComment } from '/@/api/comments';
import Header from '/@/components/Header';
import Hero from '/@/components/Hero';
import ProgressImage from '/@/components/ProgressImage';
import { hotCommentsState, newestCommentsState, useFetchMoreComments, useLikeComment } from '/@/stores/comments';
import { songState } from '/@/stores/controller';
import helper from '/@/utils/helper';

const Comments = () => {
    const history = useHistory();
    const controllerSong = useRecoilValue(songState);
    const hotList = useRecoilValue(hotCommentsState);
    const newestList = useRecoilValue(newestCommentsState);
    const fetchMoreComments = useFetchMoreComments();
    const likeComment = useLikeComment();
    const listRef = useRef<HTMLElement>(null);

    useEffect(() => {
        if (!controllerSong || !controllerSong.id) {
            history.replace('/');
        } else {
            fetchMoreComments(controllerSong.id);
        }
    }, []);

    const loadMoreComments = async () => {
        const container = listRef.current;
        if (container) {
            if (container.classList.contains(styles.loadMore)) {
                return;
            }
            if (container.scrollTop + container.offsetHeight + 100 > container.scrollHeight) {
                container.classList.add(styles.loadMore);
                await fetchMoreComments(controllerSong.id);
                container.classList.remove(styles.loadMore);
            }
        }
    };

    const renderNewest = (list: any) => {
        if (!list.length) {
            return false;
        }

        return (
            <ul className={styles.newest}>
                {list.map((e: any, index: number) => {
                    return (
                        <li key={index}>
                            <Link to={`/user/${e.user.userId}`}>{e.user.nickname}</Link>：<div>{e.content}</div>
                        </li>
                    );
                })}
            </ul>
        );
    };

    const renderComment = (key: any, item: MusicComment) => {
        if (!item) {
            return null;
        }
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
                            onClick={() => likeComment(item.commentId, !item.liked)}>
                            <ThumbUpAltTwoTone />
                        </span>

                        {formatDistance(item.time, new Date())}
                    </div>

                    {renderNewest(item.beReplied)}
                </aside>
            </div>
        );
    };

    const renderHotList = () => {
        return hotList.map((e, index: number) => {
            return renderComment(index, e);
        });
    };

    const renderNewestList = () => {
        return newestList.map((e, index: number) => {
            return renderComment(index, e);
        });
    };

    return (
        <div className={styles.container}>
            <Header transparent showBack />

            <Hero />

            <aside ref={listRef} className={styles.list} onScroll={loadMoreComments}>
                <div className={styles.scroll}>
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
