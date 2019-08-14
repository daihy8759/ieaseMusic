import { Modal, ModalBody } from 'components/Modal';
import { shell } from 'electron';
import IArtist from 'interface/IArtist';
import { inject, observer } from 'mobx-react';
import * as QRCode from 'qrcode';
import * as React from 'react';
import * as styles from './index.less';

interface IShareProps {
    share?: any;
    controller?: any;
}

@inject('share', 'controller')
@observer
class Share extends React.Component<IShareProps, {}> {
    close() {
        const { share } = this.props;
        share.toggle(false);
    }

    renderContent() {
        const {
            controller: { song }
        } = this.props;
        const url = `https://music.163.com/#/song?id=${song.id}`;
        const text = `${song.name} - ${song.artists.map((e: IArtist, index: number) => e.name).join()}`;

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
                                this.close();
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
                                this.close();
                            }}>
                            <img alt="Facebook" className={styles.social} src="assets/social-facebook.png" />
                        </a>

                        <a
                            href=""
                            onClick={e => {
                                e.preventDefault();
                                shell.openExternal(`https://plus.google.com/share?url=${encodeURIComponent(url)}`);
                                this.close();
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
                            this.close();
                        }}>
                        <img alt="Close Menus" className={styles.close} src="../../assets/close.png" />
                    </a>
                </main>
            </div>
        );
    }

    render() {
        const {
            share,
            controller: { song }
        } = this.props;

        if (!song.id) {
            return false;
        }

        return (
            <Modal show={share.show}>
                <ModalBody className={styles.modal}>{this.renderContent()}</ModalBody>
            </Modal>
        );
    }
}

export default Share;