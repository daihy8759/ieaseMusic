import classnames from 'classnames';
import Header from 'components/Header';
import Loader from 'components/Loader';
import ProgressImage from 'components/ProgressImage';
import format from 'date-fns/format';
// @ts-ignore
import delegate from 'delegate';
import IAlbum from 'interface/IAlbum';
import IArtist from 'interface/IArtist';
import IArtistProfile from 'interface/IArtistProfile';
import ISong from 'interface/ISong';
import IStore from 'interface/IStore';
import { inject } from 'mobx-react';
import * as React from 'react';
import { Link } from 'react-router-dom';
import helper from 'utils/helper';
import * as styles from './index.less';

interface IArtistProps {
    match: any;
    getArtist: any;
    play: any;
    desc: any;
    albums: any;
    highlightAlbum: any;
    loading: boolean;
    profile: IArtistProfile;
    isPlaying: any;
    follow: any;
    hasLogin: any;
    similar: IArtist[];
    playlist: any;
    sameToPlaying: any;
    song: ISong;
}

@inject((stores: IStore) => ({
    loading: stores.artist.loading,
    profile: stores.artist.profile,
    follow: stores.artist.follow,
    playlist: stores.artist.playlist,
    albums: stores.artist.albums,
    desc: stores.artist.desc,
    similar: stores.artist.similar,
    getArtist: stores.artist.getArtist,
    playing: stores.controller.playing,
    song: stores.controller.song,
    isPlaying(id: number) {
        const { controller, artist } = stores;
        let res = controller.playing && controller.playlist.id === artist.playlist.id;

        if (res && id) {
            res = controller.song.id === id;
        }
        return res;
    },
    async play(songId: number) {
        const { controller, artist } = stores;
        const sameToPlaying = this.sameToPlaying();

        if (sameToPlaying) {
            if (controller.playing && controller.song.id === songId) {
                controller.toggle();
            } else {
                await controller.play(songId);
            }
        } else {
            // Play a new playlist
            controller.setup({
                id: artist.playlist.id,
                link: `/artist/${artist.profile.id}`,
                name: artist.playlist.name,
                songs: artist.playlist.songs
            });
            await controller.play(songId);
        }
    },
    sameToPlaying() {
        const { controller, artist } = stores;
        return controller.playlist.id === artist.playlist.id;
    },
    highlightAlbum(id: number) {
        return stores.controller.playlist.id === id;
    },
    hasLogin: stores.me.hasLogin
}))
class Artist extends React.Component<IArtistProps, {}> {
    state = {
        renderTabContent: this.renderSongs.bind(this)
    };
    private headerRef = React.createRef<HTMLHeadElement>();
    private canvasRef = React.createRef<HTMLCanvasElement>();
    private listRef = React.createRef<HTMLUListElement>();

    componentDidMount() {
        const navs = Array.from(this.headerRef.current.querySelectorAll('nav'));

        delegate(this.headerRef.current, 'nav', 'click', (e: any) => {
            navs.map(d => d.classList.remove(styles.selected));
            e.target.classList.add(styles.selected);
        });

        const { match, getArtist } = this.props;
        getArtist(match.params.id);
    }

    componentDidUpdate(prevProps: IArtistProps) {
        const { listRef } = this;
        const { match } = this.props;

        if (listRef.current) {
            const playing = listRef.current.querySelector(`.${styles.playing}`);

            if (playing) {
                // @ts-ignore
                playing.scrollIntoViewIfNeeded();
            }
        }
        if (prevProps.match.params.id !== match.params.id) {
            this.props.getArtist(match.params.id);
        }
    }

    renderSongs() {
        const { playlist, sameToPlaying, song, isPlaying } = this.props;

        return (
            <ul className={styles.songs} ref={this.listRef}>
                {playlist.songs &&
                    playlist.songs.map((e: ISong, index: number) => {
                        return (
                            <li
                                className={classnames({
                                    [styles.playing]: sameToPlaying() && song.id === e.id
                                })}
                                key={e.id}
                                onClick={async () => {
                                    await this.props.play(e.id);
                                }}>
                                {isPlaying(e.id) ? (
                                    <i className="remixicon-pause-fill" />
                                ) : (
                                    <i className="remixicon-play-fill" />
                                )}

                                <span data-index>{index}</span>

                                <span data-name title={e.name}>
                                    {e.name}
                                </span>

                                <span data-album title={e.album.name}>
                                    <Link to={`/player/1/${e.album.id}`}>{e.album.name}</Link>
                                </span>

                                <span data-time>{helper.getTime(e.duration)}</span>
                            </li>
                        );
                    })}
            </ul>
        );
    }

    renderDesc() {
        const { desc } = this.props;
        const { briefDesc } = desc;
        if (!briefDesc) {
            return <section className={styles.nothing}>Nothing ...</section>;
        }
        return <section className={styles.desc}>{briefDesc}</section>;
    }

    renderAlbums() {
        const { albums, highlightAlbum } = this.props;
        if (albums) {
            return (
                <section className={styles.albums}>
                    {albums.map((e: IAlbum) => {
                        return (
                            <div
                                className={classnames(styles.album, {
                                    [styles.playing]: highlightAlbum(e.id)
                                })}
                                key={e.id}>
                                <Link to={e.link}>
                                    <ProgressImage
                                        {...{
                                            height: 48,
                                            width: 48,
                                            src: e.cover
                                        }}
                                    />
                                </Link>
                                <div className={styles.info}>
                                    <p data-name title={e.name}>
                                        {e.name}
                                    </p>

                                    <p data-time>{format(e.publishTime, 'L')}</p>
                                </div>
                            </div>
                        );
                    })}
                </section>
            );
        }
        return <section className={styles.nothing}>Nothing ...</section>;
    }

    renderArtists() {
        const { hasLogin, similar } = this.props;

        if (!hasLogin()) {
            return <section className={styles.nothing}>Nothing ...</section>;
        }

        return (
            <section className={styles.artists}>
                {similar.map((e: IArtist) => {
                    return (
                        <div className={styles.artist} key={e.name}>
                            <Link className="tooltip" data-text={e.name} to={e.link}>
                                <ProgressImage
                                    {...{
                                        height: 64,
                                        width: 64,
                                        src: e.avatar
                                    }}
                                />
                            </Link>
                        </div>
                    );
                })}
            </section>
        );
    }

    render() {
        const { loading, profile, isPlaying, follow } = this.props;
        const size = profile.size || {};
        const { followed } = profile;
        const { renderTabContent } = this.state;

        return (
            <div className={styles.container}>
                <Loader show={loading} />

                <Header
                    {...{
                        transparent: true,
                        showBack: true,
                        showPlaylist: true
                    }}
                />

                <div className={styles.hero}>
                    <ProgressImage
                        {...{
                            width: window.innerWidth,
                            height: window.innerWidth / (640 / 300),
                            src: profile.background,
                            thumb: (profile.background || '').replace(/\?.*$/, '?param=20y10')
                        }}
                    />
                    <div className={styles.inner}>
                        <div
                            role="presentation"
                            className={styles.play}
                            onClick={async () => {
                                await this.props.play();
                            }}>
                            {isPlaying() ? (
                                <i className="remixicon-pause-fill" />
                            ) : (
                                <i className="remixicon-play-fill" />
                            )}
                        </div>

                        <canvas ref={this.canvasRef} />

                        <p className={styles.name}>
                            {profile.uid ? (
                                <Link to={`/user/${profile.uid}`}>{profile.name}</Link>
                            ) : (
                                <span>{profile.name}</span>
                            )}
                        </p>

                        <div className={styles.meta}>
                            <button
                                type="button"
                                className={classnames(styles.follow, {
                                    [styles.followed]: followed
                                })}
                                onClick={e => follow(followed)}>
                                {followed ? 'Followed' : 'Follow'}
                            </button>

                            <span>{size.song} Tracks</span>

                            <span>{size.mv} MV</span>

                            <span>{size.album} Albums</span>
                        </div>
                    </div>
                </div>

                <div className={styles.body}>
                    <header ref={this.headerRef}>
                        <nav
                            onClick={e => this.setState({ renderTabContent: () => this.renderSongs() })}
                            className={styles.selected}>
                            Top 50
                        </nav>

                        <nav onClick={e => this.setState({ renderTabContent: () => this.renderAlbums() })}>专辑</nav>
                        <nav onClick={e => this.setState({ renderTabContent: () => this.renderDesc() })}>歌手详情</nav>
                        <nav onClick={e => this.setState({ renderTabContent: () => this.renderArtists() })}>
                            相似歌手
                        </nav>
                    </header>

                    <div className={styles.content}>{renderTabContent()}</div>
                </div>
            </div>
        );
    }
}

export default Artist;
