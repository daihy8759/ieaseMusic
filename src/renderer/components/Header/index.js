import classnames from 'classnames';
import { inject } from 'mobx-react';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styles from './index.less';

@inject(stores => ({
    song: stores.controller.song,
    subscribed: stores.player.meta.subscribed,
    hasLogin: stores.me.hasLogin,
    subscribe: stores.player.subscribe,
    showMenu: () => stores.menu.toggle(true),
    showPlaying: () => stores.playing.toggle(true)
}))
class Header extends Component {
    static propTypes = {
        transparent: PropTypes.bool,
        showBack: PropTypes.bool,
        showFav: PropTypes.bool,
        showPlaylist: PropTypes.bool
    };

    static defaultProps = {
        transparent: false,
        showBack: true,
        showFav: false,
        showPlaylist: true
    };

    goBack = () => window.history.back();

    renderBack() {
        const { showBack } = this.props;

        if (!showBack) {
            return false;
        }

        return <span className={styles.backward} onClick={e => this.goBack()} />;
    }

    renderPlaylist() {
        const { showPlaylist, showPlaying } = this.props;

        if (showPlaylist) {
            return <i className="remixicon-bar-chart-fill" onClick={() => showPlaying()} />;
        }

        return false;
    }

    renderFav() {
        const { hasLogin, showFav, subscribed, subscribe } = this.props;

        if (!showFav || !hasLogin()) {
            return false;
        }

        if (subscribed) {
            return (
                <i className={classnames('remixicon-star-fill', styles.subscribed)} onClick={e => subscribe(false)} />
            );
        }

        return <i className="remixicon-star-fill" onClick={e => subscribe(true)} />;
    }

    renderMenu() {
        const { showMenu } = this.props;
        return <i className="remixicon-more-2-fill" onClick={() => showMenu()} />;
    }

    render() {
        const { song, transparent, className } = this.props;

        return (
            <header className={classnames(styles.container, className)}>
                {song.id && transparent === false ? (
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
                        <figcaption
                            style={{
                                position: 'absolute',
                                left: 0,
                                top: 0,
                                width: window.innerWidth,
                                height: window.innerWidth,
                                padding: 0,
                                margin: 0,
                                backgroundImage: `url(${`${song.album.cover.replace(
                                    /\?param=.*/,
                                    ''
                                )}?param=800y800`})`,
                                backgroundSize: `${window.innerWidth}px ${window.innerWidth}px`,
                                filter: 'blur(20px)',
                                zIndex: -1
                            }}
                        />
                    </figure>
                ) : (
                    false
                )}

                <section
                    className={classnames({
                        [styles.transparent]: transparent
                    })}>
                    {this.renderBack()}

                    <div>
                        {this.renderFav()}
                        {this.renderPlaylist()}
                        {this.renderMenu()}
                    </div>
                </section>
            </header>
        );
    }
}

export default Header;
