import { useStore } from '@/context';
import classnames from 'classnames';
import Indicator from 'components/Indicator';
import ProgressImage from 'components/ProgressImage';
import IArtist from 'interface/IArtist';
import { observer } from 'mobx-react-lite';
import * as React from 'react';
import { RouteChildrenProps } from 'react-router';
import { Link } from 'react-router-dom';
import helper from 'utils/helper';
import * as styles from './index.less';

interface IHeroProps {
    location?: any;
}

const Hero: React.SFC<IHeroProps> = observer(props => {
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
                    src: song.album.cover.replace(/100y100$/, '500y500')
                }}
            />

            <a
                href=""
                className={styles.share}
                onClick={e => {
                    e.preventDefault();
                    share.toggle(true);
                }}>
                <i className="remixicon-share-fill" />
            </a>

            <summary>
                <i
                    className={classnames('remixicon-heart-fill', {
                        [styles.liked]: liked
                    })}
                    onClick={e => (liked ? unlike(song) : like(song))}
                    style={{
                        cursor: 'pointer',
                        display: 'table'
                    }}
                />

                <span className={styles.badge}>{helper.getRate(song)}</span>

                <span className={styles.badge}>
                    {pathname === '/comments' ? `${helper.humanNumber(commentsTotal)} Comments` : 'Lyrics'}
                </span>
            </summary>

            <nav>
                <article
                    className={classnames({
                        [styles.active]: pathname === '/lyrics'
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
                                marginLeft: 28
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
