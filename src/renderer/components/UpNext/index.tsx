import classnames from 'classnames';
import { Modal, ModalBody } from 'components/Modal';
import ProgressImage from 'components/ProgressImage';
import IArtist from 'interface/IArtist';
import { inject, observer } from 'mobx-react';
import * as React from 'react';
import * as styles from './index.less';

interface IUpNextProps {
    upnext?: any;
    controller?: any;
}

@inject('upnext', 'controller')
@observer
class UpNext extends React.Component<IUpNextProps, {}> {
    close() {
        this.props.upnext.hide();
    }

    renderContent() {
        const { upnext, controller } = this.props;
        const { song } = upnext;

        return (
            <div className={styles.container}>
                <h2>Up Next</h2>

                <p>
                    {song.name} - {song.artists.map((e: IArtist) => e.name).join()}
                </p>

                <figure className={styles.circle} data-percent="75">
                    <div>
                        <i className={styles.mask} />
                        <i
                            role="presentation"
                            className={classnames('remixicon-play-fill', styles.play)}
                            onClick={e => {
                                this.close();
                                controller.play(song.id);
                            }}
                        />

                        <ProgressImage
                            {...{
                                className: styles.cover,
                                height: 140,
                                width: 140,
                                src: song.album.cover
                            }}
                        />
                    </div>

                    <svg className={styles.svg} width="140" height="140">
                        <circle
                            className={styles.outter}
                            onAnimationEnd={e => {
                                if (!upnext.show) {
                                    return;
                                }
                                this.close();
                                controller.play(song.id);
                            }}
                            cx="70"
                            cy="70"
                            // (140 / 2) - (12 / 2) = 64
                            r="68"
                        />
                    </svg>
                </figure>

                <button
                    type="button"
                    onClick={() => {
                        upnext.cancel();
                        controller.pause();
                    }}>
                    Cancel
                </button>
            </div>
        );
    }

    render() {
        const { upnext } = this.props;

        return (
            <Modal show={upnext.show}>
                <ModalBody className={styles.modal}>{this.renderContent()}</ModalBody>
            </Modal>
        );
    }
}

export default UpNext;
