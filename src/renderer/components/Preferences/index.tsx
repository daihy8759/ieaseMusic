import { Button, CircularProgress, Switch, Theme, Typography } from '@material-ui/core';
import { FlashOnTwoTone, VerifiedUserTwoTone } from '@material-ui/icons';
import { createStyles, makeStyles } from '@material-ui/styles';
import classnames from 'classnames';
import Modal from 'components/Modal';
import React from 'react';
import styles from './index.less';

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
    const downloadRef = React.useRef<HTMLInputElement>();
    const usernameRef = React.useRef<HTMLInputElement>();
    const passwordRef = React.useRef<HTMLInputElement>();
    // @ts-ignore
    const classes = useStyles();

    const saveLastfm = () => {
        preferences.setLastfm({
            username: usernameRef.current.value,
            password: passwordRef.current.value,
            connected: preferences.lastFm.connected,
        });
    };

    const saveBackground = (index: number, background: any) => {
        preferences.setBackground(index, background);
    };

    const choiceDownloadDir = (e: any) => {
        e.preventDefault();
        downloadRef.current.click();
    };

    const setEnginers = (value: any) => {
        preferences.setEnginers(Object.assign({}, preferences.enginers, value));
    };

    const isConnected = () => {
        const { username, password, connected } = preferences.lastFm;
        return connected && `${username}:${password}` === connected;
    };

    const close = () => {
        preferences.hide();
    };

    const renderFm = () => {
        const { connecting } = preferences;
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
        const {
            showTray,
            setShowTray,
            showMenuBarOnLinux,
            setShowMenuBarOnLinux,
            revertTrayIcon,
            setRevertTrayIcon,
            alwaysOnTop,
            setAlwaysOnTop,
            autoPlay,
            setAutoPlay,
            showNotification,
            setShowNotification,
            highquality,
            setHighquality,
            backgrounds,
            autoupdate,
            setAutoupdate,
            scrobble,
            lastFm,
            connect,
            connecting,
            enginers,
            proxy,
            disableProxy,
            enableProxy,
            setProxy,
            downloads,
            setDownloads,
        } = preferences;

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
                                defaultChecked={alwaysOnTop}
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
                                defaultChecked={showTray}
                                id="showTray"
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setShowTray(e.target.checked)}
                            />
                        </label>

                        <label htmlFor="showMenuBarOnLinux">
                            <div>
                                <h4>Show menu bar on Linux</h4>
                                <p>Only work on Linux. Restart needed.</p>
                            </div>

                            <Switch
                                defaultChecked={showMenuBarOnLinux}
                                id="showMenuBarOnLinux"
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                    setShowMenuBarOnLinux(e.target.checked)
                                }
                            />
                        </label>

                        <label htmlFor="revertTrayIcon">
                            <div>
                                <h4>Revert tray icon to fit dark panel</h4>
                            </div>

                            <Switch
                                defaultChecked={revertTrayIcon}
                                id="revertTrayIcon"
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                    setRevertTrayIcon(e.target.checked)
                                }
                            />
                        </label>

                        <label htmlFor="autoPlay">
                            <h4>Auto play at started</h4>

                            <Switch
                                defaultChecked={autoPlay}
                                id="autoPlay"
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAutoPlay(e.target.checked)}
                            />
                        </label>

                        <label htmlFor="showNotification">
                            <h4>Show desktop notifications</h4>

                            <Switch
                                defaultChecked={showNotification}
                                id="showNotification"
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                    setShowNotification(e.target.checked)
                                }
                            />
                        </label>

                        <label htmlFor="highquality">
                            <div>
                                <h4>Only High Quality</h4>
                                <p>Only the high quality track accepted, Usually you not need enable this option.</p>
                            </div>

                            <Switch
                                defaultChecked={!!highquality}
                                id="highquality"
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setHighquality(+e.target.checked)}
                            />
                        </label>

                        <label htmlFor="autoupdate">
                            <h4>Auto update</h4>

                            <Switch
                                defaultChecked={autoupdate}
                                id="autoupdate"
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAutoupdate(e.target.checked)}
                            />
                        </label>

                        <label htmlFor="scrobble">
                            <h4>Scrobble to NeteaseCloud Music</h4>

                            <Switch
                                defaultChecked={scrobble}
                                id="scrobble"
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                    preferences.setScrobble(e.target.checked)
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
                                <Switch
                                    id="proxy"
                                    defaultChecked={!disableProxy}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => enableProxy(e.target.checked)}
                                />
                            </div>

                            <input
                                className={styles.textInput}
                                defaultValue={proxy}
                                onBlur={(ev) => setProxy(ev.target.value)}
                                placeholder="http://your.proxy.com:port"
                            />
                        </label>

                        <label className={styles.downloads}>
                            <aside>
                                <input
                                    // directory=""
                                    // webkitdirectory=""
                                    onChange={(e) => setDownloads(e.target.files[0])}
                                    ref={downloadRef}
                                    type="file"
                                />
                                <h4>Downloads</h4>
                                <p onClick={(e) => choiceDownloadDir(e)}>{downloads}</p>
                            </aside>

                            <Button onClick={(e) => choiceDownloadDir(e)}>Change</Button>
                        </label>
                    </article>

                    <article>
                        <h3>Music search enginers</h3>
                        <label htmlFor="enginerOfQQ">
                            <h4>QQ 音乐</h4>

                            <Switch
                                defaultChecked={enginers.QQ}
                                id="enginerOfQQ"
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                    setEnginers({ QQ: e.target.checked })
                                }
                            />
                        </label>
                        <label htmlFor="enginerOfMiGu">
                            <h4>咪咕音乐</h4>

                            <Switch
                                defaultChecked={enginers.MiGu}
                                id="enginerOfMiGu"
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                    setEnginers({ MiGu: e.target.checked })
                                }
                            />
                        </label>
                        <label htmlFor="enginerOfXiami">
                            <h4>虾米音乐</h4>

                            <Switch
                                defaultChecked={enginers.Xiami}
                                id="enginerOfXiami"
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                    setEnginers({ Xiami: e.target.checked })
                                }
                            />
                        </label>
                        <label htmlFor="enginerOfKugou">
                            <h4>酷狗音乐</h4>

                            <Switch
                                defaultChecked={enginers.Kugou}
                                id="enginerOfKugou"
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                    setEnginers({ Kugou: e.target.checked })
                                }
                            />
                        </label>
                        <label htmlFor="enginerOfKuwo">
                            <h4>酷我音乐</h4>

                            <Switch
                                defaultChecked={enginers.kuwo}
                                id="enginerOfKuwo"
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                    setEnginers({ Kuwo: e.target.checked })
                                }
                            />
                        </label>
                        <label htmlFor="enginerOfBaidu">
                            <h4>百度音乐</h4>

                            <Switch
                                defaultChecked={enginers.Baidu}
                                id="enginerOfBaidu"
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                    setEnginers({ Baidu: e.target.checked })
                                }
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
                            defaultValue={lastFm.username}
                            onBlur={() => saveLastfm()}
                            placeholder="Your last.fm username"
                            ref={usernameRef}
                            type="text"
                        />
                    </div>

                    <div className={styles.field}>
                        <span>Password</span>
                        <input
                            className={styles.textInput}
                            defaultValue={lastFm.password}
                            onBlur={() => saveLastfm()}
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

                    <article>
                        <h3>Playlist Background ...</h3>
                        {backgrounds &&
                            backgrounds.map((e: any, index: number) => {
                                return (
                                    <div className={styles.field} key={e.type}>
                                        <span>{e.type}</span>

                                        <input
                                            className={styles.textInput}
                                            defaultValue={e.background}
                                            onBlur={(ev) =>
                                                saveBackground(index, {
                                                    type: e.type,
                                                    background: ev.target.value,
                                                })
                                            }
                                            placeholder="Please entry the background address"
                                            type="text"
                                        />
                                    </div>
                                );
                            })}
                    </article>
                </section>
            </div>
        );
    };

    return <Modal title="Preferences..." visible={preferences.show} onCancel={close} content={renderOptions()} />;
};

export default Preferences;
