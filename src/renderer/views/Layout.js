import classnames from 'classnames';
import AudioPlayer from 'components/AudioPlayer';
import Loader from 'components/Loader';
import Menu from 'components/Menu';
import Offline from 'components/Offline';
import Playing from 'components/Playing';
import Preferences from 'components/Preferences';
import ProgressImage from 'components/ProgressImage';
import PlayerMode from 'components/Ripple/PlayerMode';
import PlayerNavigation from 'components/Ripple/PlayerNavigation';
import PlayerStatus from 'components/Ripple/PlayerStatus';
import VolumeUpDown from 'components/Ripple/VolumeUpDown';
import Share from 'components/Share';
import UpNext from 'components/UpNext';
import { inject, observer } from 'mobx-react';
import React, { Component } from 'react';
import injectSheet from 'react-jss';
import lastfm from 'utils/lastfm';

const LayoutClasses = {
    container: {
        position: 'fixed',
        left: 0,
        top: 0,
        width: '100vw',
        height: '100vh'
    },
    viewport: {
        position: 'absolute',
        left: 0,
        top: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 2
    },
    background: {
        position: 'fixed',
        left: 0,
        top: 0,
        width: '100%'
    },
    cover: {
        '&::after': {
            content: '""',
            position: 'absolute',
            left: 0,
            top: 0,
            height: '100%',
            width: '100%',
            background: 'rgba(0, 0, 0, .3)',
            zIndex: 1
        }
    }
};

@inject('controller')
@observer
class _Background extends Component {
    render() {
        const {
            classes,
            controller: { song }
        } = this.props;

        return (
            <div className={classes.cover}>
                {song && song.id ? (
                    <ProgressImage
                        className={classes.background}
                        {...{
                            width: window.innerWidth,
                            src: `${song.album.cover.replace(/\?param=.*/, '')}?param=800y800`
                        }}
                    />
                ) : (
                    false
                )}
            </div>
        );
    }
}
const Background = injectSheet(LayoutClasses)(_Background);

@inject('me', 'preferences')
@observer
class Layout extends Component {
    state = {
        offline: false
    };

    async componentWillMount() {
        const { me, preferences } = this.props;

        await preferences.init();
        await me.init();

        const { username, password } = preferences.lastFm;

        await lastfm.initialize(username, password);
    }

    componentDidMount() {
        window.addEventListener('offline', () => {
            this.setState({
                offline: true
            });
        });

        window.addEventListener('online', () => {
            this.setState({
                offline: false
            });
        });
    }

    render() {
        const {
            classes,
            children,
            me: { initialized }
        } = this.props;
        const { offline } = this.state;

        if (offline) {
            return <Offline show />;
        }
        if (!initialized) {
            return <Loader show />;
        }
        return (
            <div className={classes.container}>
                <main
                    className={classnames({
                        [classes.viewport]: true
                    })}>
                    {children}
                </main>
                <AudioPlayer />
                <UpNext />
                <Share />
                <Preferences />
                <Menu />
                <VolumeUpDown />
                <Playing />
                <PlayerNavigation />
                <PlayerMode />
                <PlayerStatus />
                <Background />
            </div>
        );
    }
}

export default injectSheet(LayoutClasses)(Layout);
