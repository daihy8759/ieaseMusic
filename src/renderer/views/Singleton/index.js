import classnames from 'classnames';
import Header from 'components/Header';
import ProgressImage from 'components/ProgressImage';
import { inject } from 'mobx-react';
import React, { Component } from 'react';
import colors from 'utils/colors';
import helper from 'utils/helper';
import styles from './index.less';

@inject(stores => ({
    song: stores.controller.song,
    like: stores.me.like,
    unlike: stores.me.unlike,
    isLiked: stores.me.isLiked,
    playing: stores.controller.playing
}))
class Singleton extends Component {
    componentDidUpdate(prevProps) {
        const { playing } = this.props;
        if (prevProps.playing === playing) {
            return;
        }
        let ele = this.circle;

        if (!ele) return;

        ele = ele.firstElementChild;

        if (playing) {
            ele.classList.remove(styles.pause);
        } else {
            ele.classList.add(styles.pause);
        }
    }

    render() {
        const { song, isLiked, like, unlike } = this.props;
        const liked = isLiked(song.id);

        return (
            <div className={styles.container}>
                <Header
                    {...{
                        transparent: true,
                        showBack: true
                    }}
                />

                <summary>
                    <i
                        className={classnames('ion-ios-heart', {
                            [styles.liked]: liked
                        })}
                        onClick={e => (liked ? unlike(song) : like(song))}
                        style={{
                            cursor: 'pointer',
                            display: 'table'
                        }}
                    />

                    <span className={styles.highquality}>{helper.getRate(song)}</span>
                </summary>

                <main>
                    <div
                        className={styles.circle}
                        style={{
                            filter: `drop-shadow(3mm 6mm 12mm ${colors.randomColor()})`
                        }}
                        ref={ele => {
                            this.circle = ele;
                        }}>
                        <ProgressImage
                            {...{
                                width: 260,
                                height: 260,
                                src: `${song.album.cover.replace(/\?.*$/, '')}?param=200y200`
                            }}
                        />
                    </div>
                </main>
            </div>
        );
    }
}

export default Singleton;
