import { useStore } from '@/context';
import classnames from 'classnames';
import Controller from 'components/Controller';
import Header from 'components/Header';
import Loader from 'components/Loader';
import ProgressImage from 'components/ProgressImage';
import { observer } from 'mobx-react-lite';
import * as React from 'react';
import { Link } from 'react-router-dom';
import helper from 'utils/helper';
import * as styles from './index.less';

const User: React.FC = observer(() => {
    const { user, controller, me } = useStore();
    const [hovered, setHovered] = React.useState();

    if (user.loading) {
        return <Loader show />;
    }

    const isme = () => {
        if (!me.profile.userId) {
            return false;
        }
        return user.profile.id === me.profile.userId;
    };

    const isPlaying = (id: number) => {
        return controller.playing && controller.playlist.id === id;
    };

    const renderList = () => {
        const { playlists } = user;

        return playlists.map((e: any) => {
            return (
                <Link
                    className={classnames('clearfix', styles.item, {
                        [styles.playing]: isPlaying(e.id)
                    })}
                    to={e.link}
                    key={e.id}
                    onMouseEnter={() => setHovered(e)}
                    onMouseLeave={() => setHovered(null)}>
                    <h2>
                        <span>{e.name}</span>
                    </h2>

                    <p className={styles.played}>
                        <span>
                            {helper.humanNumber(e.played)}
                            Played
                        </span>
                    </p>
                </Link>
            );
        });
    };

    const { profile, follow } = user;
    const { followed } = profile;

    return (
        <div className={styles.container}>
            <Header
                {...{
                    transparent: true,
                    showBack: true,
                    showPlaylist: true
                }}
            />

            <button
                style={{
                    display: isme() ? 'none' : 'block'
                }}
                className={classnames(styles.follow, {
                    [styles.followed]: followed
                })}
                type="button"
                onClick={() => follow(followed)}>
                {followed ? 'Followed' : 'Follow'}
            </button>

            <figure
                style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    height: '100%',
                    width: '100%',
                    padding: 0,
                    margin: 0,
                    overflow: 'hidden'
                }}>
                <img
                    alt=""
                    src={profile.avatar}
                    className={styles.avatar}
                    style={{
                        width: window.innerWidth,
                        height: window.innerWidth
                    }}
                    onLoad={(e: any) => {
                        e.target.classList.add(styles.expose);
                    }}
                />

                <div className={styles.overlay} />
            </figure>

            <main>
                <aside className={styles.hero}>
                    <div style={{ width: 200 }}>
                        <h3>{profile.name}</h3>

                        <p data-label="Followers">{helper.formatNumber(profile.followers)}</p>

                        <p data-label="Following">{helper.formatNumber(profile.following)}</p>

                        <div className={styles.signature}>
                            <span title={profile.signature}>{profile.signature || 'No signature~'}</span>
                        </div>
                    </div>

                    <ProgressImage
                        className={styles.preview}
                        {...{
                            height: 260,
                            width: 260,
                            src: hovered && hovered.cover ? hovered.cover : profile.avatar
                        }}
                    />
                </aside>

                <section className={styles.list}>{renderList()}</section>
            </main>

            <Controller key={controller.song.id} />
        </div>
    );
});

export default User;
