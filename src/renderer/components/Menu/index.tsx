import { useStore } from '@/context';
import classnames from 'classnames';
import FadeImage from 'components/FadeImage';
import { remote } from 'electron';
import { observer } from 'mobx-react-lite';
import * as React from 'react';
import { Link } from 'react-router-dom';
import * as styles from './index.less';

const Menu: React.SFC = observer(() => {
    const { menu, me } = useStore();
    const { show } = menu;
    if (!show) {
        return null;
    }
    const doLogout = () => {
        remote.getCurrentWindow().webContents.session.clearStorageData();
        me.logout();
    };

    const close = () => {
        menu.toggle(false);
    };

    const renderMe = () => {
        const { hasLogin, profile } = me;
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
                    <a className={styles.logout} href="" onClick={doLogout}>
                        Logout
                    </a>
                </div>
            </article>
        );
    };

    return (
        <div
            tabIndex={-1}
            className={styles.container}
            // Press ESC close menu
            onKeyUp={e => e.keyCode === 27 && close()}>
            <div className={styles.overlay} onClick={close} />
            <section className={styles.body}>
                <div>
                    {renderMe()}

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
});

export default Menu;
