import classnames from 'classnames';
import FadeImage from 'components/FadeImage';
import { remote } from 'electron';
import { inject } from 'mobx-react';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styles from './index.less';

@inject(stores => ({
    show: stores.menu.show,
    hasLogin: stores.me.hasLogin,
    profile: stores.me.profile,
    logout: stores.me.logout,
    close: () => stores.menu.toggle(false)
}))
class Menu extends Component {
    componentDidUpdate(prevProps) {
        const { show } = this.props;
        if (prevProps !== show && show === true) {
            setTimeout(() => {
                this.container.focus();
            });
        }
    }

    doLogout() {
        // Clear cookies
        const { logout } = this.props;
        remote.getCurrentWindow().webContents.session.clearStorageData();
        logout();
    }

    renderMe() {
        const { close, hasLogin, profile } = this.props;
        const link = `/user/${profile.userId}`;

        if (!hasLogin()) {
            return (
                <p>
                    <Link onClick={close} to="/login/0">
                        Sign in
                    </Link>
                </p>
            );
        }

        return (
            <article className={styles.profile}>
                <Link className="clearfix" onClick={close} to={link}>
                    <FadeImage src={profile.avatarUrl} />
                </Link>

                <div className={styles.info}>
                    <p className={styles.username} onClick={close} title={profile.nickname}>
                        <Link to={link}>{profile.nickname}</Link>
                    </p>
                    <a className={styles.logout} href="" onClick={e => this.doLogout()}>
                        Logout
                    </a>
                </div>
            </article>
        );
    }

    render() {
        const { show, close } = this.props;

        if (!show) {
            return false;
        }

        return (
            <div
                tabIndex="-1"
                className={styles.container}
                // Press ESC close menu
                onKeyUp={e => e.keyCode === 27 && close()}
                ref={ele => {
                    this.container = ele;
                }}>
                <div className={styles.overlay} onClick={close} />
                <section className={styles.body}>
                    <div>
                        {this.renderMe()}

                        <div className={styles.navs}>
                            <p>
                                <Link onClick={close} to="/">
                                    Home
                                </Link>
                            </p>
                            <p>
                                <Link onClick={close} to="/search">
                                    Search
                                </Link>
                            </p>
                            <p>
                                <Link onClick={close} to="/playlist/全部">
                                    Playlist
                                </Link>
                            </p>
                            <p>
                                <Link onClick={close} to="/top">
                                    Top
                                </Link>
                            </p>

                            <p>
                                <Link onClick={close} to="/fm">
                                    Made For You
                                </Link>
                            </p>
                        </div>
                    </div>

                    <div className={styles.social}>
                        <a
                            className={classnames('tooltip', styles.github)}
                            data-text="Fork me on Github"
                            href="https://github.com/daihy8759"
                            rel="noopener noreferrer"
                            target="_blank">
                            <i className="remixicon-github-fill" />
                        </a>
                    </div>
                </section>
            </div>
        );
    }
}

export default Menu;
