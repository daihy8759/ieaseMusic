import classnames from 'classnames';
import Indicator from 'components/Indicator';
import ProgressImage from 'components/ProgressImage';
import IArtist from 'interface/IArtist';
import ISong from 'interface/ISong';
import IStore from 'interface/IStore';
import { inject } from 'mobx-react';
import * as React from 'react';
import { Link } from 'react-router-dom';
import helper from 'utils/helper';
import * as styles from './index.less';

interface IHeroProps {
    song?: ISong;
    isLiked?: any;
    unlike?: any;
    like?: any;
    comments?: any;
    showShare?: any;
    location: any;
}

@inject((stores: IStore) => ({
    like: stores.me.like,
    unlike: stores.me.unlike,
    isLiked: stores.me.isLiked,
    song: stores.controller.song,
    comments: stores.comments.total,
    showShare: stores.share.toggle
}))
class Hero extends React.Component<IHeroProps, {}> {
    render() {
        const { song, isLiked, unlike, like, comments, showShare, location } = this.props;
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
                        showShare(true);
                    }}>
                    <i className="ion-android-share-alt" />
                </a>

                <summary>
                    <i
                        className={classnames('ion-ios-heart', {
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
                        {pathname === '/comments' ? `${helper.humanNumber(comments)} Comments` : 'Lyrics'}
                    </span>
                </summary>

                <nav>
                    <article
                        className={classnames({
                            [styles.active]: pathname === '/lyrics'
                        })}>
                        <Link to={`/${pathname === '/comments' ? 'lyrics' : 'comments'}`}>
                            {pathname === '/comments' ? 'Lyrics' : `${helper.humanNumber(comments)} Comments`}
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
    }
}

export default Hero;
