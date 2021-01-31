import { useStore } from '@/context';
import classnames from 'classnames';
import { PlayArrowSharp } from '@material-ui/icons';
import Modal from 'components/Modal';
import ProgressImage from 'components/ProgressImage';
import IArtist from 'interface/IArtist';
import { observer } from 'mobx-react-lite';
import * as React from 'react';
import styles from './index.less';

const UpNext: React.SFC = observer(() => {
    const { upnext, controller } = useStore();

    const close = () => {
        upnext.hide();
    };

    const renderContent = () => {
        const { song } = upnext;

        return (
            <div className={styles.container}>
                <p>
                    {song.name} - {song.artists.map((e: IArtist) => e.name).join()}
                </p>

                <figure className={styles.circle} data-percent="75">
                    <div>
                        <i className={styles.mask} />
                        <PlayArrowSharp
                            className={classnames('remixicon-play-fill', styles.play)}
                            onClick={() => {
                                close();
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
                            onAnimationEnd={() => {
                                if (!upnext.show) {
                                    return;
                                }
                                close();
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
    };

    return <Modal visible={upnext.show} content={renderContent()} />;
});

export default UpNext;
