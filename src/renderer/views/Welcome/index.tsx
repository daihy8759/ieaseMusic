import { playListState, togglePlayListState, togglePlayState } from '@/stores/controller';
import { homeListQuery } from '@/stores/home';
import { loginState } from '@/stores/me';
import { ArrowForwardTwoTone } from '@material-ui/icons';
import classnames from 'classnames';
import Controller from 'components/Controller';
import Indicator from 'components/Indicator';
import ProgressImage from 'components/ProgressImage';
import formatDistance from 'date-fns/formatDistance';
import React, { FunctionComponent, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import helper from 'utils/helper';
import styles from './index.less';
import Profile from './Profile';

interface IStatusProps {
    playing?: boolean;
}

const Status: FunctionComponent<IStatusProps> = (props) => {
    const { playing } = props;

    if (!playing) {
        return null;
    }

    return (
        <div className={styles.status}>
            <Indicator />
        </div>
    );
};

const Welcome = () => {
    const hasLogin = useRecoilValue(loginState);
    const homeList = useRecoilValue(homeListQuery);
    const controllerPlayList = useRecoilValue(playListState);
    const togglePlayList = useSetRecoilState(togglePlayListState);
    const togglePlay = useSetRecoilState(togglePlayState);

    useEffect(() => {
        togglePlayList({ playList: homeList[0] });
    }, []);

    const play = (playList: any) => {
        if (controllerPlayList.id === playList.id) {
            togglePlay();
        }
        togglePlayList({
            playList,
        });
    };

    const renderFavorite = (favorite: any = {}) => {
        if (!favorite || favorite.size === 0) {
            return false;
        }

        return (
            <Link className={styles.clearfix} to={favorite.link || '#'}>
                {Status({ playing: controllerPlayList.id === favorite.id })}

                <div className={styles.hovered}>
                    <ArrowForwardTwoTone />
                </div>

                <figure className={classnames(styles.item, styles.favorite)}>
                    <ProgressImage
                        {...{
                            className: styles.background,
                            width: 360,
                            src: favorite.background,
                        }}
                    />

                    <figcaption>
                        <ProgressImage
                            className={styles.cover}
                            pallet={favorite.pallet && favorite.pallet[0]}
                            {...{
                                height: 50,
                                width: 50,
                                src: favorite.cover,
                            }}
                        />

                        <summary>
                            <p>{favorite.name}</p>

                            <small>{favorite.updateTime && formatDistance(favorite.updateTime, new Date())}</small>
                        </summary>
                    </figcaption>
                </figure>
            </Link>
        );
    };

    const renderRecommend = (recommend: any = {}) => {
        return (
            <Link className={styles.clearfix} to="#" onClick={() => play(recommend)}>
                <Status playing={controllerPlayList.id === recommend.id} />

                <div className={styles.hovered}>
                    <ArrowForwardTwoTone />
                </div>

                <figure className={classnames(styles.item, styles.recommend)}>
                    <figcaption>
                        <ProgressImage
                            className={styles.cover}
                            pallet={recommend.pallet && recommend.pallet[1]}
                            {...{
                                height: 50,
                                width: 50,
                                src: recommend.cover,
                            }}
                        />

                        <summary>
                            <p>{recommend.name}</p>

                            <small>{`${recommend.size} Tracks`}</small>
                        </summary>
                    </figcaption>
                </figure>
            </Link>
        );
    };

    const renderPlaylist = (list: any) => {
        return list.map((e: any, index: number) => {
            return (
                <Link className={styles.clearfix} key={index} to={e.link}>
                    <Status playing={controllerPlayList.id === e.id} />

                    <div className={styles.hovered}>
                        <ArrowForwardTwoTone />
                    </div>

                    <figure className={classnames(styles.item, styles.large)}>
                        <ProgressImage
                            pallet={e.pallet && e.pallet[0]}
                            {...{
                                width: 360,
                                src: e.background,
                                className: classnames(styles.background, {
                                    [styles.album]: e.type,
                                }),
                            }}
                        />

                        <figcaption>
                            <ProgressImage
                                className={styles.cover}
                                {...{
                                    height: 50,
                                    width: 50,
                                    src: e.cover,
                                }}
                            />

                            <summary>
                                <p>{e.name}</p>

                                <small>
                                    {e.type === 0 ? `${helper.humanNumber(e.played)} PLAYED` : `${e.size} Tracks`}
                                </small>
                            </summary>
                        </figcaption>
                    </figure>
                </Link>
            );
        });
    };
    const hasRecommend = hasLogin && homeList.length > 1 && homeList[1].size;

    return (
        <div className={styles.container}>
            <main>
                <Profile />
                {homeList.length ? (
                    <section className={styles.list}>
                        {hasLogin ? renderFavorite(homeList[0]) : false}
                        {hasRecommend ? renderRecommend(homeList[1]) : false}
                        {renderPlaylist(hasLogin ? homeList.slice(2, homeList.length) : homeList.slice())}
                    </section>
                ) : (
                    <div className={styles.placeholder} />
                )}
            </main>
            <Controller />
        </div>
    );
};

export default Welcome;
