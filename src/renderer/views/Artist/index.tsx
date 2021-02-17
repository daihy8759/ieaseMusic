import classnames from 'classnames';
import React, { FC } from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import Detail from './Detail';
import styles from './index.module.less';
import PlayStatus from './PlayStatus';
import Header from '/@/components/Header';
import ProgressImage from '/@/components/ProgressImage';
import { fetchArtistState } from '/@/stores/artist';
interface MatchParams {
    id: string;
}

const Artist: FC<RouteComponentProps<MatchParams>> = (props) => {
    const artist = useRecoilValue(fetchArtistState(parseInt(props.match.params.id)));
    const { profile } = artist;
    const size = profile.size || ({} as any);
    const { followed } = profile;
    const canvasRef = React.useRef<HTMLCanvasElement>(null);

    return (
        <div className={styles.container}>
            <Header
                {...{
                    transparent: true,
                    showPlaylist: true,
                }}
            />

            <div className={styles.hero}>
                <ProgressImage
                    {...{
                        width: window.innerWidth,
                        height: window.innerWidth / (640 / 300),
                        src: profile.background,
                        thumb: (profile.background || '').replace(/\?.*$/, '?param=20y10'),
                    }}
                />
                <div className={styles.inner}>
                    <PlayStatus />

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
                                [styles.followed]: followed,
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

            <Detail />
        </div>
    );
};

export default Artist;
