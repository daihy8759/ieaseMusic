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
import lastfm from 'utils/lastfm';
import styles from './index.less';

@inject('controller')
@observer
class Background extends Component {
    render() {
        const {
            controller: { song }
        } = this.props;

        return (
            <div className={styles.cover}>
                {song && song.id ? (
                    <ProgressImage
                        className={styles.background}
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
            <div className={styles.container}>
                <main
                    className={classnames({
                        [styles.viewport]: true
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

export default Layout;
