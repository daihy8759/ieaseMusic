import React, { FC } from 'react';
import { Link } from 'react-router-dom';
import { useRecoilValueLoadable } from 'recoil';
import styles from '../index.module.less';
import Loader from '/@/components/Loader';
import ProgressImage from '/@/components/ProgressImage';
import IPlayList from '/@/interface/IPlayList';
import { playlistQueryState } from '/@/stores/search';
import helper from '/@/utils/helper';

interface PlaylistProps {
    playlists: IPlayList[];
}

const Playlist: FC<PlaylistProps> = (props) => {
    const { playlists } = props;

    if (playlists.length === 0) {
        return (
            <div className={styles.placeholder}>
                <span>Nothing ...</span>
            </div>
        );
    }

    return (
        <>
            {playlists.map((e: any) => {
                return (
                    <Link className={styles.row} key={e.id} to={e.link}>
                        <ProgressImage
                            {...{
                                src: e.cover,
                                height: 40,
                                width: 40,
                            }}
                        />

                        <aside>
                            <span>{e.name}</span>

                            <div>
                                <div className="rounded-full bg-amber-50 text-amber-900 px-2 py-0.5 hidden sm:flex lg:hidden xl:flex items-center space-x-1">
                                    <dd>{helper.humanNumber(e.star)}</dd>
                                    <dt className="text-amber-500">
                                        <svg width="16" height="20" fill="currentColor">
                                            <path d="M7.05 3.691c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.372 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.539 1.118l-2.8-2.034a1 1 0 00-1.176 0l-2.8 2.034c-.783.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.363-1.118L.98 9.483c-.784-.57-.381-1.81.587-1.81H5.03a1 1 0 00.95-.69L7.05 3.69z" />
                                        </svg>
                                    </dt>
                                </div>

                                <span className={styles.played}>{helper.humanNumber(e.played)} Played</span>
                            </div>

                            <span className={styles.tracks}>{e.size} Tracks</span>
                        </aside>
                    </Link>
                );
            })}
        </>
    );
};

const PlaylistsLoadable = () => {
    const playlistsLoadable = useRecoilValueLoadable(playlistQueryState);

    switch (playlistsLoadable.state) {
        case 'hasValue':
            const playlists = playlistsLoadable.contents;
            return <Playlist playlists={playlists} />;
        case 'loading':
            return <Loader />;
        case 'hasError':
            return (
                <div className={styles.placeholder}>
                    <span>Nothing ...</span>
                </div>
            );
    }
};

export default PlaylistsLoadable;
