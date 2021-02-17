import { Button, CircularProgress, Switch, Theme, Typography } from '@material-ui/core';
import { FlashOnTwoTone, VerifiedUserTwoTone } from '@material-ui/icons';
import { createStyles, makeStyles } from '@material-ui/styles';
import classnames from 'classnames';
import React, { useRef } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import styles from './index.module.less';
import Modal from '/@/components/Modal';
import {
    alwaysOnTopState,
    autoPlayState,
    connectingState,
    lastFmState,
    preferencesShowState,
    proxyEnableState,
    proxyState,
    revertTrayIconState,
    showNotificationState,
    showTrayState,
} from '/@/stores/preferences';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        button: {
            margin: theme.spacing(1),
        },
        leftIcon: {
            marginRight: theme.spacing(1),
        },
    })
);

const Preferences = () => {
    const usernameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const classes = useStyles();
    const connecting = useRecoilValue(connectingState);
    const [autoPlay, setAutoPlay] = useRecoilState(autoPlayState);
    const [show, setShow] = useRecoilState(preferencesShowState);
    const [lastFm, setLastFm] = useRecoilState(lastFmState);
    const [alwaysOnTop, setAlwaysOnTop] = useRecoilState(alwaysOnTopState);
    const [showTray, setShowTray] = useRecoilState(showTrayState);
    const [showNotification, setShowNotification] = useRecoilState(showNotificationState);
    const [proxy, setProxy] = useRecoilState(proxyState);
    const [proxyEnable, setProxyEnable] = useRecoilState(proxyEnableState);
    const [revertTrayIcon, setRevertTrayIcon] = useRecoilState(revertTrayIconState);

    const saveLastfm = () => {
        setLastFm({
            username: usernameRef.current?.value || '',
            password: passwordRef.current?.value || '',
            connected: lastFm.connected,
        });
    };

    const isConnected = () => {
        const { username, password, connected } = lastFm;
        return connected && `${username}:${password}` === connected;
    };

    const connect = () => {
        //TODO connect fm
    };

    const close = () => {
        setShow(false);
    };

    const renderFm = () => {
        if (connecting) {
            return (
                <>
                    <CircularProgress size={14} />
                    <Typography>Connecting to Last.fm</Typography>
                </>
            );
        }
        if (isConnected()) {
            return (
                <>
                    <VerifiedUserTwoTone className={classes.leftIcon} />
                    Connected to Last.fm
                </>
            );
        }
        return (
            <>
                <FlashOnTwoTone className={classes.leftIcon} />
                Connect to Last.fm
            </>
        );
    };

    const renderOptions = () => {
        return (
            <div className={styles.container}>
                <section>
                    <article>
                        <label htmlFor="alwaysOnTop">
                            <div>
                                <h4>Always on Top</h4>
                                <p>Make the player that stays on top</p>
                            </div>

                            <Switch
                                checked={alwaysOnTop}
                                id="alwaysOnTop"
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAlwaysOnTop(e.target.checked)}
                            />
                        </label>

                        <label htmlFor="showTray">
                            <div>
                                <h4>Show menu bar icon</h4>
                                <p>
                                    If the menu bar icon is hidden, you can still access ieaseMusic using the dock icon.
                                </p>
                            </div>

                            <Switch
                                checked={showTray}
                                id="showTray"
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setShowTray(e.target.checked)}
                            />
                        </label>

                        <label htmlFor="revertTrayIcon">
                            <div>
                                <h4>Revert tray icon to fit dark panel</h4>
                            </div>

                            <Switch
                                checked={revertTrayIcon}
                                id="revertTrayIcon"
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                    setRevertTrayIcon(e.target.checked)
                                }
                            />
                        </label>

                        <label htmlFor="autoPlay">
                            <h4>Auto play at started</h4>

                            <Switch
                                checked={autoPlay}
                                id="autoPlay"
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAutoPlay(e.target.checked)}
                            />
                        </label>

                        <label htmlFor="showNotification">
                            <h4>Show desktop notifications</h4>

                            <Switch
                                checked={showNotification}
                                id="showNotification"
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                    setShowNotification(e.target.checked)
                                }
                            />
                        </label>

                        <label
                            style={{
                                display: 'block',
                            }}>
                            <div style={{ display: 'inline-block' }}>
                                <h4>HTTP proxy</h4>
                                <p>Need restart app.</p>
                            </div>
                            <div style={{ float: 'right' }}>
                                <Switch checked={proxyEnable} onChange={(e) => setProxyEnable(e.target.checked)} />
                            </div>

                            <input
                                className={styles.textInput}
                                value={proxy}
                                onChange={(ev) => setProxy(ev.target.value)}
                                placeholder="http://your.proxy.com:port"
                            />
                        </label>
                    </article>

                    <h3>
                        Connect to Last.fm
                        <small>Track what you listen to, whenever you listen.</small>
                    </h3>
                    <div className={styles.field}>
                        <span>Username</span>
                        <input
                            className={styles.textInput}
                            value={lastFm.username}
                            onChange={() => saveLastfm()}
                            placeholder="Your last.fm username"
                            ref={usernameRef}
                            type="text"
                        />
                    </div>

                    <div className={styles.field}>
                        <span>Password</span>
                        <input
                            className={styles.textInput}
                            value={lastFm.password}
                            onChange={() => saveLastfm()}
                            placeholder="Your last.fm password"
                            ref={passwordRef}
                            type="password"
                        />
                    </div>
                    <Button
                        variant="contained"
                        color="primary"
                        className={classnames(classes.button, styles.connect, {
                            [styles.connected]: isConnected(),
                        })}
                        disabled={isConnected() || connecting || !lastFm.username || !lastFm.password}
                        onClick={() => connect()}>
                        {renderFm()}
                    </Button>
                </section>
            </div>
        );
    };

    return <Modal title="Preferences..." visible={show} onCancel={close} content={renderOptions()} />;
};

export default Preferences;
