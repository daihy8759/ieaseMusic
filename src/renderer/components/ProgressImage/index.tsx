import classnames from 'classnames';
import React from 'react';
import { useUpdateEffect } from 'react-use';
import styles from './index.module.less';

interface ProgressImageProps {
    src?: string;
    className?: string;
    style?: any;
    width: number;
    height?: number;
    thumb?: string;
    pallet?: number[];
    fallback?: string;
}

const ProgressImage: React.FC<ProgressImageProps> = ({
    src,
    className,
    style = {},
    thumb,
    height,
    width,
    pallet,
    fallback = 'https://source.unsplash.com/random',
}) => {
    let thumbNew = thumb;
    if (!src) return null;

    if (!thumbNew) {
        // Get the thumb image src
        thumbNew = `${src.replace(/\?.*$/, '')}?param=20y20`;
    }

    const containerRef = React.useRef<HTMLElement>();
    const thumbRef = React.useRef<HTMLDivElement>();

    const handleError = (e: any) => {
        e.target.src = fallback;
    };

    const handleLoad = () => {
        if (thumbRef.current) {
            thumbRef.current.style.paddingBottom = '0%';
        }
        if (containerRef.current) {
            setTimeout(() => {
                if (containerRef.current) {
                    containerRef.current.classList.add(styles.loaded);
                }
            }, 50);
        }
    };

    useUpdateEffect(() => {
        if (containerRef.current) {
            containerRef.current.classList.remove(styles.loaded);
        }
    }, [src]);

    if (pallet) {
        style.boxShadow = `0 0 24px rgb(${pallet.join()})`;
    }

    return (
        <figure
            className={classnames(styles.container, className)}
            ref={containerRef}
            style={Object.assign(
                {
                    height,
                    width,
                },
                style
            )}>
            <img
                alt=""
                className={styles.main}
                onError={handleError}
                onLoad={handleLoad}
                src={src}
                style={{
                    height,
                    width,
                }}
            />
            <div
                className={styles.thumb}
                ref={thumbRef}
                style={{
                    paddingBottom: (height / width) * 100 || 0,
                }}>
                <img
                    alt=""
                    {...{
                        src: thumbNew,
                        style: {
                            height,
                            width,
                        },
                        onLoad(e: any) {
                            // Default show the gray background, When image has been loaded show the thumb
                            e.target.classList.add(styles.loaded);
                        },
                    }}
                />
            </div>
        </figure>
    );
};

export default ProgressImage;
