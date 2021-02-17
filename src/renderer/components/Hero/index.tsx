import { Button, IconButton } from '@material-ui/core';
import { FavoriteBorderTwoTone, FavoriteTwoTone, ShareTwoTone } from '@material-ui/icons';
import classnames from 'classnames';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import AdapterLink from '../AdapterLink';
import styles from './index.module.less';
import Indicator from '/@/components/Indicator';
import ProgressImage from '/@/components/ProgressImage';
import { fetchListState } from '/@/stores/comments';
import { songState } from '/@/stores/controller';
import { isLiked, useToggleLike } from '/@/stores/me';
import { shareShowState } from '/@/stores/share';
import helper from '/@/utils/helper';

const Hero = () => {
    const location = useLocation();
    const { pathname } = location;
    const song = useRecoilValue(songState);
    if (!song || !song.id) {
        return null;
    }
    const comments = useRecoilValue(fetchListState(song.id));
    const { total: commentsTotal } = comments;
    const setShow = useSetRecoilState(shareShowState);
    const toggleLike = useToggleLike();
    const liked = isLiked(song.id);

    return (
        <div className={styles.container}>
            <ProgressImage
                {...{
                    height: window.innerHeight,
                    width: window.innerHeight,
                    src: song.album?.cover?.replace(/100y100$/, '500y500'),
                }}
            />

            <Button
                className={styles.share}
                component={AdapterLink}
                to=""
                onClick={(e: any) => {
                    e.preventDefault();
                    setShow(true);
                }}>
                <ShareTwoTone />
            </Button>

            <summary>
                <IconButton
                    onClick={() => {
                        toggleLike({ id: song.id, like: !liked });
                    }}>
                    {liked ? <FavoriteTwoTone className={styles.liked} /> : <FavoriteBorderTwoTone />}
                </IconButton>
                <span className={styles.badge}>{helper.getRate(song)}</span>

                <span className={styles.badge}>
                    {pathname === '/comments' ? `${helper.humanNumber(commentsTotal)} Comments` : 'Lyrics'}
                </span>
            </summary>

            <nav>
                <article
                    className={classnames({
                        [styles.active]: pathname === '/lyrics',
                    })}>
                    <Link to={`/${pathname === '/comments' ? 'lyrics' : 'comments'}`}>
                        {pathname === '/comments' ? 'Lyrics' : `${helper.humanNumber(commentsTotal)} Comments`}
                    </Link>
                </article>

                <article>
                    <Link to="/singleton">
                        Cover
                        <Indicator
                            style={{
                                marginLeft: 28,
                            }}
                        />
                    </Link>
                </article>
            </nav>

            <footer>
                <h3>{song.name}</h3>

                <p className={styles.author}>
                    {song.artists?.map((e, index) => {
                        return (
                            <Link key={index} to={e.link}>
                                {e.name}
                            </Link>
                        );
                    })}
                </p>
            </footer>
        </div>
    );
};

export default Hero;
