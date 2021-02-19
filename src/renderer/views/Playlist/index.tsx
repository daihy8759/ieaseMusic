import Grid from '@material-ui/core/Grid';
import classnames from 'classnames';
import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from 'recoil';
import styles from './index.module.less';
import Controller from '/@/components/Controller';
import Header from '/@/components/Header';
import ProgressImage from '/@/components/ProgressImage';
import { playListState } from '/@/stores/controller';
import { fetchListState, types, typeState } from '/@/stores/playlist';
import helper from '/@/utils/helper';

const Playlist = () => {
    const [type, setType] = useRecoilState(typeState);
    const playlist = useRecoilValue(fetchListState);
    const listRef = useRef<HTMLElement>(null);
    const playList = useRecoilValue(playListState);
    const { playList: list } = playlist;

    const isPlaying = (id: string) => {
        return playList.id === id;
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
        <div className={styles.container} data-type={encodeURIComponent(type)}>
            <Header
                {...{
                    transparent: true,
                    showBack: true,
                }}
            />

            <div className={styles.inner}>
                <ul className={styles.navs}>
                    {types.map((e: any) => {
                        const selected = type === e.name;
                        return (
                            <li
                                key={e.name}
                                className={classnames(styles.nav, {
                                    [styles.selected]: selected,
                                })}>
                                <Link to="#" onClick={() => setType(e.name)}>
                                    {e.name}
                                    {selected && `/ ${list.length} LIST`}
                                </Link>
                            </li>
                        );
                    })}
                </ul>

                <section className={styles.list} ref={listRef}>
                    {renderList()}
                </section>

                <Controller />
            </div>
        </div>
    );
};

export default Playlist;
