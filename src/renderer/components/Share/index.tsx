import { observer } from 'mobx-react-lite';
import * as QRCode from 'qrcode';
import React from 'react';
import styles from './index.module.less';
import * as closePng from '/@/assets/close.png';
import * as socialFacebook from '/@/assets/social-facebook.png';
import * as socialTwitter from '/@/assets/social-twitter.png';
import Modal from '/@/components/Modal';
import { useStore } from '/@/context';
import { useShell } from '/@/hooks';
import IArtist from '/@/interface/IArtist';

const shell = useShell();

const Share: React.SFC = observer(() => {
    const {
        share,
        controller: { song },
    } = useStore();
    if (!song.id) {
        return null;
    }
    const close = () => {
        share.toggle(false);
    };

    const renderContent = () => {
        const url = `https://music.163.com/#/song?id=${song.id}`;
        const text = `${song.name} - ${song.artists.map((e: IArtist) => e.name).join()}`;

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

    return <Modal visible={share.show} fullScreen content={renderContent()} onCancel={close} />;
});

export default Share;
