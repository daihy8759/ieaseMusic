import classnames from 'classnames';
import Header from 'components/Header';
import ProgressImage from 'components/ProgressImage';
import { inject, observer } from 'mobx-react';
import React, { Component } from 'react';
import injectSheet from 'react-jss';
import colors from 'utils/colors';
import helper from 'utils/helper';
import SingletonClasses from './classes';

@inject(stores => ({
    song: stores.controller.song,
    like: stores.me.like,
    unlike: stores.me.unlike,
    isLiked: stores.me.isLiked,
    playing: stores.controller.playing
}))
@observer
class Singleton extends Component {
    componentWillReceiveProps(nextProps) {
        const { classes } = this.props;
        let ele = this.circle;

        if (!ele) return;

        ele = ele.firstElementChild;

        if (nextProps.playing) {
            ele.classList.remove(classes.pause);
        } else {
            ele.classList.add(classes.pause);
        }
    }

    render() {
        const { classes, song, isLiked, like, unlike } = this.props;
        const liked = isLiked(song.id);

        return (
            <div className={classes.container}>
                <Header
                    {...{
                        transparent: true,
                        showBack: true
                    }}
                />

                <summary>
                    <i
                        className={classnames('ion-ios-heart', {
                            [classes.liked]: liked
                        })}
                        onClick={e => (liked ? unlike(song) : like(song))}
                        style={{
                            cursor: 'pointer',
                            display: 'table'
                        }}
                    />

                    <span className={classes.highquality}>{helper.getRate(song)}</span>
                </summary>

                <main>
                    <div
                        className={classes.circle}
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

export default injectSheet(SingletonClasses)(Singleton);
