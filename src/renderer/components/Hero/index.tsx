import { Button, IconButton } from '@material-ui/core';
import { FavoriteBorderTwoTone, FavoriteTwoTone, ShareTwoTone } from '@material-ui/icons';
import classnames from 'classnames';
import IArtist from 'interface/IArtist';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { Link } from 'react-router-dom';
import AdapterLink from '../AdapterLink';
import styles from './index.module.less';
import Indicator from '/@/components/Indicator';
import ProgressImage from '/@/components/ProgressImage';
import { useStore } from '/@/context';
import helper from '/@/utils/helper';

interface IHeroProps {
    location?: any;
}

const Hero: React.SFC<IHeroProps> = observer((props) => {
    const { location } = props;
    const { me, comments, controller, share } = useStore();
    const { isLiked, unlike, like } = me;
    const { total: commentsTotal } = comments;
    const { song } = controller;
    const { pathname } = location;
    const liked = isLiked(song.id);

    return (
        <div className={styles.container}>
            <ProgressImage
                {...{
                    height: window.innerHeight,
                    width: window.innerHeight,
                    src: song.album.cover.replace(/100y100$/, '500y500'),
                }}
            />

            <Button
                className={styles.share}
                component={AdapterLink}
                to=""
                onClick={(e: any) => {
                    e.preventDefault();
                    share.toggle(true);
                }}>
                <ShareTwoTone />
            </Button>

            <summary>
                <IconButton onClick={() => (liked ? unlike(song) : like(song))}>
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
                    {song.artists.map((e: IArtist, index: number) => {
                        // Show the artist
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
});

export default Hero;
