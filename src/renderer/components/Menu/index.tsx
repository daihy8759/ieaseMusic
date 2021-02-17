import { IconButton, SvgIcon } from '@material-ui/core';
import classnames from 'classnames';
import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from 'recoil';
import styles from './index.module.less';
import FadeImage from '/@/components/FadeImage';
import { useShell } from '/@/hooks';
import { loginState, logout, profileState } from '/@/stores/me';
import { menuShowState } from '/@/stores/menu';

const shell = useShell();

const Menu = () => {
    const history = useHistory();
    const hasLogin = useRecoilValue(loginState);
    const profile = useRecoilValue(profileState);
    const [show, setShow] = useRecoilState(menuShowState);
    if (!show) {
        return null;
    }
    const doLogout = () => {
        logout().then(() => {
            history.go(0);
        });
    };

    const close = () => {
        setShow(false);
    };

    const renderMe = () => {
        const link = `/user/${profile.userId}`;

        if (!hasLogin) {
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
            onKeyUp={(e) => e.keyCode === 27 && close()}>
            <div className={styles.overlay} onClick={close} />
            <section className={classnames('pl-4', styles.body)}>
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
                    <IconButton
                        onClick={(e) => {
                            e.preventDefault();
                            shell.openExternal('https://github.com/daihy8759/ieaseMusic');
                            close();
                        }}>
                        <SvgIcon>
                            <path
                                d={`M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12`}
                            />
                        </SvgIcon>
                    </IconButton>
                </div>
            </section>
        </div>
    );
};

export default Menu;
