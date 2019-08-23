import { useStore } from '@/context';
import { Modal, ModalBody } from 'components/Modal';
import { shell } from 'electron';
import IArtist from 'interface/IArtist';
import { observer } from 'mobx-react-lite';
import * as closePng from 'assets/close.png';
import * as QRCode from 'qrcode';
import * as React from 'react';
import * as styles from './index.less';

const Share: React.SFC = observer(() => {
    const {
        share,
        controller: { song }
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
                            onClick={e => {
                                e.preventDefault();
                                shell.openExternal(
                                    `https://twitter.com/intent/tweet?url=${encodeURIComponent(
                                        url
                                    )}&text=${encodeURIComponent(text)}`
                                );
                                close();
                            }}>
                            <img alt="Twitter" className={styles.social} src="assets/social-twitter.png" />
                        </a>
                        <a
                            href=""
                            onClick={e => {
                                e.preventDefault();
                                shell.openExternal(
                                    `https://facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
                                );
                                close();
                            }}>
                            <i className="remixicon-facebook-fill"></i>
                        </a>

                        <a
                            href=""
                            onClick={e => {
                                e.preventDefault();
                                shell.openExternal(`https://plus.google.com/share?url=${encodeURIComponent(url)}`);
                                close();
                            }}>
                            <img alt="Google" className={styles.social} src="assets/social-google.png" />
                        </a>
                    </section>

                    <figure className={styles.qrcode}>
                        <img
                            alt=""
                            ref={async ele => {
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
                        onClick={e => {
                            e.preventDefault();
                            close();
                        }}>
                        <img alt="Close Menus" className={styles.close} src={closePng} />
                    </a>
                </main>
            </div>
        );
    };

    return (
        <Modal show={share.show}>
            <ModalBody className={styles.modal}>{renderContent()}</ModalBody>
        </Modal>
    );
});

export default Share;
