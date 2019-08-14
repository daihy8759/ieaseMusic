import classnames from 'classnames';
import Header from 'components/Header';
import ProgressImage from 'components/ProgressImage';
import ISong from 'interface/ISong';
import IStore from 'interface/IStore';
import { inject } from 'mobx-react';
import * as React from 'react';
import colors from 'utils/colors';
import helper from 'utils/helper';
import * as styles from './index.less';

interface ISingletonProps {
    playing: boolean;
    song: ISong;
    isLiked: any;
    like: any;
    unlike: any;
}

@inject((stores: IStore) => ({
    song: stores.controller.song,
    like: stores.me.like,
    unlike: stores.me.unlike,
    isLiked: stores.me.isLiked,
    playing: stores.controller.playing
}))
class Singleton extends React.Component<ISingletonProps, {}> {
    private circleRef = React.createRef<HTMLDivElement>();

    componentDidUpdate(prevProps: ISingletonProps) {
        const { playing } = this.props;
        if (prevProps.playing === playing) {
            return;
        }
        let ele = this.circleRef.current;

        if (!ele) return;

        if (playing) {
            ele.firstElementChild.classList.remove(styles.pause);
        } else {
            ele.firstElementChild.classList.add(styles.pause);
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
                        ref={this.circleRef}>
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
