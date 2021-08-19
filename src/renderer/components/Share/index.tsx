import * as QRCode from 'qrcode';
import React from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import styles from './index.module.less';
import closePng from '/@/assets/close.png';
import socialFacebook from '/@/assets/social-facebook.png';
import socialTwitter from '/@/assets/social-twitter.png';
import Modal from '/@/components/Modal';
import { useShell } from '/@/hooks';
import Artist from '/@/interface/Artist';
import { songState } from '/@/stores/controller';
import { shareShowState } from '/@/stores/share';

const shell = useShell();

const Share = () => {
    const song = useRecoilValue(songState);
    const [show, setShow] = useRecoilState(shareShowState);

    if (!song || !song.id) {
        return null;
    }
    const close = () => {
        setShow(false);
    };

    const renderContent = () => {
        const url = `https://music.163.com/#/song?id=${song.id}`;
        const text = `${song.name} - ${song.artists?.map((e: Artist) => e.name).join()}`;

        return (
            <div className={styles.container}>
                <main>
                    <summary>
                        <h2>Share</h2>

                        <p>{text}</p>
                    </summary>

                    <section>
                        <a
                            href=""
                            onClick={(e) => {
                                e.preventDefault();
                                shell.openExternal(
                                    `https://twitter.com/intent/tweet?url=${encodeURIComponent(
                                        url
                                    )}&text=${encodeURIComponent(text)}`
                                );
                                close();
                            }}>
                            <img alt="Twitter" className={styles.social} src={socialTwitter} />
                        </a>
                        <a
                            href=""
                            onClick={(e) => {
                                e.preventDefault();
                                shell.openExternal(
                                    `https://facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
                                );
                                close();
                            }}>
                            <img alt="Facebook" className={styles.social} src={socialFacebook} />
                        </a>
                    </section>

                    <figure className={styles.qrcode}>
                        <img
                            alt=""
                            ref={async (ele) => {
                                if (!ele) return;
                                const base64 = await QRCode.toDataURL(url);
                                ele.src = base64;
                            }}
                        />

                        <figcaption>WeChat</figcaption>
                    </figure>

                    <a
                        href=""
                        className={styles.close}
                        onClick={(e) => {
                            e.preventDefault();
                            close();
                        }}>
                        <img alt="Close Menus" className={styles.close} src={closePng} />
                    </a>
                </main>
            </div>
        );
    };

    return <Modal visible={show} fullScreen content={renderContent()} onCancel={close} />;
};

export default Share;
