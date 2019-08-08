import classnames from 'classnames';
import Controller from 'components/Controller';
import Header from 'components/Header';
import Loader from 'components/Loader';
import ProgressImage from 'components/ProgressImage';
import { inject, observer } from 'mobx-react';
import React, { Component } from 'react';
import injectSheet from 'react-jss';
import { Link } from 'react-router-dom';
import helper from 'utils/helper';
import UserClasses from './classes';

@inject(stores => ({
    loading: stores.user.loading,
    getUser: stores.user.getUser,
    profile: stores.user.profile,
    playlists: stores.user.playlists,
    follow: stores.user.follow,
    controller: stores.controller,
    isme: () => stores.user.profile.id === stores.me.profile.userId.toString(),
    isPlaying: id => {
        const { controller } = stores;

        return controller.playing && controller.playlist.id === id;
    }
}))
@observer
class User extends Component {
    state = {
        hovered: false
    };

    componentWillMount = () => {
        const { getUser, match } = this.props;
        getUser(match.params.id);
    };

    componentWillReceiveProps(nextProps) {
        const { match } = this.props;

        if (nextProps.match.params.id !== match.params.id) {
            nextProps.getUser(nextProps.match.params.id);
        }
    }

    renderList() {
        const { classes, playlists, isPlaying } = this.props;

        return playlists.map(e => {
            return (
                <Link
                    className={classnames('clearfix', classes.item, {
                        [classes.playing]: isPlaying(e.id)
                    })}
                    to={e.link}
                    key={e.id}
                    onMouseEnter={ev => this.setState({ hovered: e })}
                    onMouseLeave={ev => this.setState({ hovered: false })}>
                    <h2>
                        <span>{e.name}</span>
                    </h2>

                    <p className={classes.played}>
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
        const { classes, loading, profile, isme, follow, controller } = this.props;
        const { hovered } = this.state;
        const { followed } = profile;

        // Force rerender all, let image progressively load
        if (loading) {
            return <Loader show />;
        }

        return (
            <div className={classes.container}>
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
                    className={classnames(classes.follow, {
                        [classes.followed]: followed
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
                        className={classes.avatar}
                        style={{
                            width: window.innerWidth,
                            height: window.innerWidth
                        }}
                        onLoad={e => {
                            e.target.classList.add(classes.expose);
                        }}
                    />

                    <div className={classes.overlay} />
                </figure>

                <main>
                    <aside className={classes.hero}>
                        <div style={{ width: 200 }}>
                            <h3>{profile.name}</h3>

                            <p data-label="Followers">{helper.formatNumber(profile.followers)}</p>

                            <p data-label="Following">{helper.formatNumber(profile.following)}</p>

                            <div className={classes.signature}>
                                <span title={profile.signature}>{profile.signature || 'No signature~'}</span>
                            </div>
                        </div>

                        <ProgressImage
                            className={classes.preview}
                            {...{
                                height: 260,
                                width: 260,
                                src: hovered ? hovered.cover : profile.avatar
                            }}
                        />
                    </aside>

                    <section className={classes.list}>{this.renderList()}</section>
                </main>

                <Controller key={controller.song.id} />
            </div>
        );
    }
}

export default injectSheet(UserClasses)(User);
