import { fetchArtistState } from '@/stores/artist';
import {
    playingState,
    playListState,
    songState,
    togglePlayListState,
    togglePlaySongState,
    togglePlayState
} from '@/stores/controller';
import { loginState } from '@/stores/me';
import { Fab } from '@material-ui/core';
import { PauseSharp, PlayArrowSharp } from '@material-ui/icons';
import classnames from 'classnames';
import Header from 'components/Header';
import ProgressImage from 'components/ProgressImage';
import format from 'date-fns/format';
// @ts-ignore
import delegate from 'delegate';
import IAlbum from 'interface/IAlbum';
import IArtist from 'interface/IArtist';
import ISong from 'interface/ISong';
import * as React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { useEffectOnce } from 'react-use';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import helper from 'utils/helper';
import * as styles from './index.less';

interface MatchParams {
    id: string;
}

interface ArtistProps extends RouteComponentProps<MatchParams> {}

const Artist: React.FC<ArtistProps> = props => {
    const playList = useRecoilValue(playListState);
    const playing = useRecoilValue(playingState);
    const song = useRecoilValue(songState);
    const hasLogin = useRecoilValue(loginState);
    const togglePlayList = useSetRecoilState(togglePlayListState);
    const togglePlay = useSetRecoilState(togglePlayState);
    const togglePlaySong = useSetRecoilState(togglePlaySongState);
    const artist = useRecoilValue(fetchArtistState(parseInt(props.match.params.id)));
    const { profile } = artist;
    const size = profile.size || {};
    const { followed } = profile;
    const [renderTab, setRenderTab] = React.useState('renderSongs');
    const headerRef = React.useRef<HTMLHeadElement>();
    const canvasRef = React.useRef<HTMLCanvasElement>();
    const listRef = React.useRef<HTMLUListElement>();

    useEffectOnce(() => {
        const navs = Array.from(headerRef.current.querySelectorAll('nav'));

        delegate(headerRef.current, 'nav', 'click', (e: any) => {
            navs.map(d => d.classList.remove(styles.selected));
            e.target.classList.add(styles.selected);
        });
    });

    const sameToPlaying = () => {
        return playList.id === artist.playlist.id;
    };

    const isPlaying = (id?: number) => {
        let res = playing && playList.id === artist.playlist.id;

        if (res && id) {
            res = song.id === id;
        }
        return res;
    };

    const highlightAlbum = (id: number) => {
        return playList.id === id;
    };

    const play = async (songId?: number) => {
        const isSameToPlaying = sameToPlaying();

        if (isSameToPlaying) {
            if (playing && song.id === songId) {
                togglePlay();
            } else {
                togglePlaySong(songId);
            }
        } else {
            togglePlayList({
                playList: {
                    id: artist.playlist.id,
                    link: `/artist/${artist.profile.id}`,
                    name: artist.playlist.name,
                    songs: artist.playlist.songs
                },
                songId
            });
        }
    };

    const renderSongs = () => {
        const { playlist } = artist;

        return (
            <ul className={styles.songs} ref={listRef}>
                {playlist.songs &&
                    playlist.songs.map((e: ISong, index: number) => {
                        return (
                            <li
                                className={classnames({
                                    [styles.playing]: sameToPlaying() && song.id === e.id
                                })}
                                key={e.id}
                                onClick={() => play(e.id)}>
                                {isPlaying(e.id) ? <PauseSharp /> : <PlayArrowSharp />}

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
    };

    const renderDesc = () => {
        const { desc } = artist;
        const { briefDesc } = desc;
        if (!briefDesc) {
            return <section className={styles.nothing}>Nothing ...</section>;
        }
        return <section className={styles.desc}>{briefDesc}</section>;
    };

    const renderAlbums = () => {
        const { albums } = artist;
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
    };

    const renderArtists = () => {
        const { similar } = artist;

        if (!hasLogin) {
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
    };

    const renderTabContent = () => {
        switch (renderTab) {
            case 'renderAlbums':
                return renderAlbums();
            case 'renderDesc':
                return renderDesc();
            case 'renderArtists':
                return renderArtists();
            default:
                return renderSongs();
        }
    };

    return (
        <div className={styles.container}>
            <Header
                {...{
                    transparent: true,
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
                    <Fab onClick={() => play()} className={styles.play}>
                        {isPlaying() ? <PauseSharp /> : <PlayArrowSharp />}
                    </Fab>

                    <canvas ref={canvasRef} />

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
                            onClick={() => follow(followed)}>
                            {followed ? 'Followed' : 'Follow'}
                        </button>

                        <span>{size.song} Tracks</span>

                        <span>{size.mv} MV</span>

                        <span>{size.album} Albums</span>
                    </div>
                </div>
            </div>

            <div className={styles.body}>
                <header ref={headerRef}>
                    <nav onClick={() => setRenderTab('renderSongs')} className={styles.selected}>
                        Top 50
                    </nav>

                    <nav onClick={() => setRenderTab('renderAlbums')}>专辑</nav>
                    <nav onClick={() => setRenderTab('renderDesc')}>歌手详情</nav>
                    <nav onClick={() => setRenderTab('renderArtists')}>相似歌手</nav>
                </header>

                <div className={styles.content}>{renderTabContent()}</div>
            </div>
        </div>
    );
};

export default Artist;
