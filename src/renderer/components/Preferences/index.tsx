import { Switch } from '@material-ui/core';
import React from 'react';
import { useRecoilState } from 'recoil';
import styles from './index.module.less';
import Modal from '/@/components/Modal';
import {
    alwaysOnTopState,
    autoPlayState,
    preferencesShowState,
    proxyEnableState,
    proxyState,
    revertTrayIconState,
    showNotificationState,
    showTrayState,
} from '/@/stores/preferences';

const Preferences = () => {
    const [autoPlay, setAutoPlay] = useRecoilState(autoPlayState);
    const [show, setShow] = useRecoilState(preferencesShowState);
    const [alwaysOnTop, setAlwaysOnTop] = useRecoilState(alwaysOnTopState);
    const [showTray, setShowTray] = useRecoilState(showTrayState);
    const [showNotification, setShowNotification] = useRecoilState(showNotificationState);
    const [proxy, setProxy] = useRecoilState(proxyState);
    const [proxyEnable, setProxyEnable] = useRecoilState(proxyEnableState);
    const [revertTrayIcon, setRevertTrayIcon] = useRecoilState(revertTrayIconState);

    const close = () => {
        setShow(false);
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
                </section>
            </div>
        );
    };

    return <Modal title="Preferences..." visible={show} onCancel={close} content={renderOptions()} />;
};

export default Preferences;
