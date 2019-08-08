import classnames from 'classnames';
import { Modal, ModalBody } from 'components/Modal';
import ProgressImage from 'components/ProgressImage';
import { inject, observer } from 'mobx-react';
import React, { Component } from 'react';
import injectSheet, { ThemeProvider } from 'react-jss';
import theme from '../../theme';
import UpNextClasses from './classes';

@inject('upnext', 'controller')
@observer
class UpNext extends Component {
    close() {
        const { upnext } = this.props;
        upnext.show = false;
    }

    renderContent() {
        const { classes, upnext, controller } = this.props;
        const { song } = upnext;

        return (
            <div className={classes.container}>
                <h2>Up Next</h2>

                <p>
                    {song.name} - {song.artists.map((e, index) => e.name).join()}
                </p>

                <figure className={classes.circle} data-percent="75">
                    <div
                        style={{
                            height: 140,
                            width: 140,
                            borderRadius: 140,
                            overflow: 'hidden'
                        }}>
                        <i className={classes.mask} />
                        <i
                            role="presentation"
                            className={classnames('ion-ios-play', classes.play)}
                            onClick={e => {
                                this.close();
                                controller.play(song.id);
                            }}
                        />

                        <ProgressImage
                            {...{
                                className: classes.cover,
                                height: 140,
                                width: 140,
                                src: song.album.cover
                            }}
                        />
                    </div>

                    <svg className={classes.svg} width="140" height="140">
                        <circle
                            className={classes.outter}
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
                        // Stop the player and mark current song as
                        // canceled, when resume replay
                        upnext.cancel();
                        controller.playing = false;
                    }}>
                    Cancel
                </button>
            </div>
        );
    }

    render() {
        const { classes, upnext } = this.props;

        return (
            <Modal show={upnext.show}>
                <ModalBody className={classes.modal}>
                    <ThemeProvider theme={theme}>{this.renderContent()}</ThemeProvider>
                </ModalBody>
            </Modal>
        );
    }
}

export default injectSheet(UpNextClasses)(UpNext);
