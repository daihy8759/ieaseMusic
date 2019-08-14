import closePng from 'assets/close.png';
import classnames from 'classnames';
import { Modal, ModalBody, ModalHeader } from 'components/Modal';
import Switch from 'components/Switch';
import { inject, observer } from 'mobx-react';
import * as React from 'react';
import * as styles from './index.less';

interface IPreferenceProps {
    preferences?: any;
    connecting?: boolean;
    setScrobble?: any;
}

@inject('preferences')
@observer
class Preferences extends React.Component<IPreferenceProps, {}> {
    private downloadRef = React.createRef<HTMLInputElement>();
    private usernameRef = React.createRef<HTMLInputElement>();
    private passwordRef = React.createRef<HTMLInputElement>();

    setEnginers(value: any) {
        const { preferences } = this.props;

        preferences.setEnginers(Object.assign({}, preferences.enginers, value));
    }

    saveLastfm() {
        const { preferences } = this.props;

        preferences.setLastfm({
            username: this.usernameRef.current.value,
            password: this.passwordRef.current.value,
            connected: preferences.lastFm.connected
        });
    }

    saveBackground(index: number, background: any) {
        const { preferences } = this.props;
        preferences.setBackground(index, background);
    }

    close() {
        this.props.preferences.hide();
    }

    isConnected() {
        const { preferences } = this.props;
        const { username, password, connected } = preferences.lastFm;

        return connected && `${username}:${password}` === connected;
    }

    choiceDownloadDir(e: any) {
        e.preventDefault();
        this.downloadRef.current.click();
    }

    renderFm = () => {
        const { connecting } = this.props;
        if (connecting) {
            return (
                <span>
                    <i className="ion-ios-loop" />
                    Connecting to Last.fm
                </span>
            );
        }
        if (this.isConnected()) {
            return (
                <span>
                    <i className="ion-android-done" />
                    Connected to Last.fm
                </span>
            );
        }
        return (
            <span>
                <i className="ion-flash" />
                Connect to Last.fm
            </span>
        );
    };

    renderOptions() {
        const { preferences } = this.props;
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
            setDownloads
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
                                defaultChecked={highquality}
                                id="highquality"
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setHighquality(+e.target.checked)}
                            />
                        </label>

                        <label htmlFor="autoupdate">
                            <h4>Auto update</h4>

                            <Switch
                                defaultChecked={autoupdate}
                                id="autoupdate"
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAutoupdate(+e.target.checked)}
                            />
                        </label>

                        <label htmlFor="scrobble">
                            <h4>Scrobble to NeteaseCloud Music</h4>

                            <Switch
                                defaultChecked={scrobble}
                                id="scrobble"
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                    this.props.setScrobble(+e.target.checked)
                                }
                            />
                        </label>
                        <label
                            style={{
                                display: 'block'
                            }}>
                            <div style={{ display: 'inline-block' }}>
                                <h4>HTTP proxy</h4>
                                <p>Need restart app.</p>
                            </div>
                            <div style={{ float: 'right' }}>
                                <Switch
                                    id="proxy"
                                    defaultChecked={!disableProxy}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                        enableProxy(+e.target.checked)
                                    }
                                />
                            </div>

                            <input
                                className={styles.textInput}
                                defaultValue={proxy}
                                onBlur={ev => setProxy(ev.target.value)}
                                placeholder="http://your.proxy.com:port"
                            />
                        </label>

                        <label className={styles.downloads}>
                            <aside>
                                <input
                                    // directory=""
                                    // webkitdirectory=""
                                    onChange={e => setDownloads(e.target.files[0])}
                                    ref={this.downloadRef}
                                    type="file"
                                />
                                <h4>Downloads</h4>
                                <p onClick={e => this.choiceDownloadDir(e)}>{downloads}</p>
                            </aside>

                            <button type="button" onClick={e => this.choiceDownloadDir(e)}>
                                Change
                            </button>
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
                                    this.setEnginers({ QQ: e.target.checked })
                                }
                            />
                        </label>
                        <label htmlFor="enginerOfMiGu">
                            <h4>咪咕音乐</h4>

                            <Switch
                                defaultChecked={enginers.MiGu}
                                id="enginerOfMiGu"
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                    this.setEnginers({ MiGu: e.target.checked })
                                }
                            />
                        </label>
                        <label htmlFor="enginerOfXiami">
                            <h4>虾米音乐</h4>

                            <Switch
                                defaultChecked={enginers.Xiami}
                                id="enginerOfXiami"
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                    this.setEnginers({ Xiami: e.target.checked })
                                }
                            />
                        </label>
                        <label htmlFor="enginerOfKugou">
                            <h4>酷狗音乐</h4>

                            <Switch
                                defaultChecked={enginers.Kugou}
                                id="enginerOfKugou"
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                    this.setEnginers({ Kugou: e.target.checked })
                                }
                            />
                        </label>
                        <label htmlFor="enginerOfKuwo">
                            <h4>酷我音乐</h4>

                            <Switch
                                defaultChecked={enginers.Kuwo}
                                id="enginerOfKuwo"
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                    this.setEnginers({ Kuwo: e.target.checked })
                                }
                            />
                        </label>
                        <label htmlFor="enginerOfBaidu">
                            <h4>百度音乐</h4>

                            <Switch
                                defaultChecked={enginers.Baidu}
                                id="enginerOfBaidu"
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                    this.setEnginers({ Baidu: e.target.checked })
                                }
                            />
                        </label>
                    </article>

                    <article>
                        <h3>
                            Connect to Last.fm
                            <small>Track what you listen to, whenever you listen.</small>
                        </h3>
                        <div className={styles.field}>
                            <span>Username</span>
                            <input
                                className={styles.textInput}
                                defaultValue={lastFm.username}
                                onBlur={ev => this.saveLastfm()}
                                placeholder="Your last.fm username"
                                ref={this.usernameRef}
                                type="text"
                            />
                        </div>

                        <div className={styles.field}>
                            <span>Password</span>
                            <input
                                className={styles.textInput}
                                defaultValue={lastFm.password}
                                onBlur={ev => this.saveLastfm()}
                                placeholder="Your last.fm password"
                                ref={this.passwordRef}
                                type="password"
                            />
                        </div>
                        <button
                            type="button"
                            className={classnames(styles.connect, {
                                [styles.connected]: this.isConnected()
                            })}
                            disabled={this.isConnected() || connecting || !lastFm.username || !lastFm.password}
                            onClick={e => connect()}>
                            {this.renderFm()}
                        </button>
                    </article>

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
                                            onBlur={ev =>
                                                this.saveBackground(index, {
                                                    type: e.type,
                                                    background: ev.target.value
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
    }

    render() {
        const { preferences } = this.props;

        return (
            <Modal show={preferences.show} onCancel={() => this.close()}>
                <ModalHeader className={styles.header}>
                    Preferences...
                    <i className={styles.close} onClick={() => this.close()}>
                        <img alt="Close Menus" className={styles.close} src={closePng} />
                    </i>
                </ModalHeader>

                <ModalBody className={styles.modal}>{this.renderOptions()}</ModalBody>
            </Modal>
        );
    }
}

export default Preferences;