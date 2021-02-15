import Grid from '@material-ui/core/Grid';
import classnames from 'classnames';
import React, { FC, useRef } from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import styles from './index.module.less';
import Controller from '/@/components/Controller';
import Header from '/@/components/Header';
import ProgressImage from '/@/components/ProgressImage';
import { playListState } from '/@/stores/controller';
import { fetchListState, types } from '/@/stores/playlist';
import helper from '/@/utils/helper';

interface MatchParams {
    type: string;
}

const Playlist: FC<RouteComponentProps<MatchParams>> = (props) => {
    const {
        match: { params },
    } = props;
    const type = params.type;
    const playlist = useRecoilValue(fetchListState(type));
    const listRef = useRef<HTMLElement>(null);
    const playList = useRecoilValue(playListState);
    const { playList: list, nextOffset } = playlist;

    const isPlaying = (id: string) => {
        return playList.id === id;
    };

    const loadMore = async () => {
        const container = listRef.current;
        if (container) {
            // Drop the duplicate invoke
            if (container.classList.contains(styles.loadmore)) {
                return;
            }

            if (container.scrollTop + container.offsetHeight + 50 > container.scrollHeight) {
                // Mark as loading
                container.classList.add(styles.loadmore);
                // TODO load more
                // await playlist.loadmore();
                container.classList.remove(styles.loadmore);
            }
        }
    };

    const renderList = () => {
        return (
            <Grid container>
                {list.map((e: any, index: number) => {
                    return (
                        <Grid item xs={6} key={index}>
                            <article
                                className={classnames(styles.item, {
                                    [styles.playing]: isPlaying(e.id),
                                })}>
                                <Link to={e.link}>
                                    <ProgressImage
                                        {...{
                                            height: 64,
                                            width: 64,
                                            src: e.cover,
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
                        </Grid>
                    );
                })}
            </Grid>
        );
    };

    return (
        <div className={styles.container} data-type={encodeURIComponent(params.type)}>
            <Header
                {...{
                    transparent: true,
                    showBack: true,
                }}
            />

            <div className={styles.inner}>
                <ul className={styles.navs}>
                    {types.map((e: any) => {
                        const selected = params.type === e.name;
                        return (
                            <li
                                key={e.name}
                                className={classnames(styles.nav, {
                                    [styles.selected]: selected,
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

                <section className={styles.list} ref={listRef} onScroll={loadMore}>
                    {renderList()}
                </section>

                <Controller />
            </div>
        </div>
    );
};

export default Playlist;
