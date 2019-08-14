import classnames from 'classnames';
import Controller from 'components/Controller';
import Header from 'components/Header';
import Loader from 'components/Loader';
import ProgressImage from 'components/ProgressImage';
import IStore from 'interface/IStore';
import IUserProfile from 'interface/IUserProfile';
import { inject } from 'mobx-react';
import * as React from 'react';
import { Link } from 'react-router-dom';
import helper from 'utils/helper';
import * as styles from './index.less';

interface IUserProps {
    getUser: any;
    match: any;
    playlists: any;
    isPlaying: any;
    loading: boolean;
    profile: IUserProfile;
    isme: any;
    follow: any;
    controller: any;
}

@inject((stores: IStore) => ({
    loading: stores.user.loading,
    getUser: stores.user.getUser,
    profile: stores.user.profile,
    playlists: stores.user.playlists,
    follow: stores.user.follow,
    controller: stores.controller,
    isme: () => {
        if (!stores.me.profile.userId) {
            return false;
        }
        return stores.user.profile.id === stores.me.profile.userId;
    },
    isPlaying: (id: number) => {
        const { controller } = stores;

        return controller.playing && controller.playlist.id === id;
    }
}))
class User extends React.Component<IUserProps, {}> {
    state = {
        hovered: {
            cover: ''
        }
    };

    componentDidMount() {
        const { getUser, match } = this.props;
        getUser(match.params.id);
    }

    componentDidUpdate(prevProps: IUserProps) {
        const { match, getUser } = this.props;

        if (prevProps.match.params.id !== match.params.id) {
            getUser(match.params.id);
        }
    }

    renderList() {
        const { playlists, isPlaying } = this.props;

        return playlists.map((e: any) => {
            return (
                <Link
                    className={classnames('clearfix', styles.item, {
                        [styles.playing]: isPlaying(e.id)
                    })}
                    to={e.link}
                    key={e.id}
                    onMouseEnter={ev => this.setState({ hovered: e })}
                    onMouseLeave={ev => this.setState({ hovered: false })}>
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
    }

    render() {
        const { loading, profile, isme, follow, controller } = this.props;
        const { hovered } = this.state;
        const { followed } = profile;

        // Force rerender all, let image progressively load
        if (loading) {
            return <Loader show />;
        }

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
                    onClick={e => follow(followed)}>
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

                    <section className={styles.list}>{this.renderList()}</section>
                </main>

                <Controller key={controller.song.id} />
            </div>
        );
    }
}

export default User;
