import classnames from 'classnames';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styles from './index.less';

class ProgressImage extends Component {
    static propTypes = {
        src: PropTypes.string,
        thumb: PropTypes.string,
        height: PropTypes.number,
        width: PropTypes.number,
        fallback: PropTypes.string
    };

    static defaultProps = {
        fallback: 'https://source.unsplash.com/random'
    };

    componentDidUpdate(prevProps) {
        const { container } = this;
        const { src } = this.props;
        if (container && prevProps.src !== src) {
            // Immediate render the new image
            container.classList.remove(styles.loaded);
        }
    }

    handleError(e) {
        const { fallback } = this.props;
        e.target.src = fallback;
    }

    handleLoad() {
        const ele = this.container;
        this.thumb.style.paddingBottom = '0%';

        if (ele) {
            setTimeout(() => {
                ele.classList.add(styles.loaded);
            }, 50);
        }
    }

    render() {
        const { className, style, src, height, width } = this.props;
        let { thumb } = this.props;

        if (!src) return false;

        if (!thumb) {
            // Get the thumb image src
            thumb = `${src.replace(/\?.*$/, '')}?param=20y20`;
        }

        return (
            <figure
                className={classnames(styles.container, className)}
                ref={ele => {
                    this.container = ele;
                }}
                style={Object.assign(
                    {
                        height,
                        width
                    },
                    style
                )}>
                <img
                    alt=""
                    className={styles.main}
                    onError={e => this.handleError(e)}
                    onLoad={e => this.handleLoad(e)}
                    src={src}
                    style={{
                        height,
                        width
                    }}
                />

                <div
                    className={styles.thumb}
                    ref={ele => {
                        this.thumb = ele;
                    }}
                    style={{
                        // Use as placeholder, anti reflow
                        paddingBottom: (height / width) * 100 || 0
                    }}>
                    <img
                        alt=""
                        {...{
                            src: thumb,
                            style: {
                                height,
                                width
                            },
                            onLoad(e) {
                                // Default show the gray background, When image has been loaded show the thumb
                                e.target.classList.add(styles.loaded);
                            }
                        }}
                    />
                </div>
            </figure>
        );
    }
}

export default ProgressImage;
