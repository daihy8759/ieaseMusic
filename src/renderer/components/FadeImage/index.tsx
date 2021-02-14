import classnames from 'classnames';
import React from 'react';
import { useUpdateEffect } from 'react-use';
import styles from './index.module.less';

interface FadeImageProps {
    src?: string;
    className?: string;
    fallback?: string;
    title?: string;
}

const FadeImage: React.SFC<FadeImageProps> = (props) => {
    const { src, className, fallback = 'https://source.unsplash.com/random' } = props;

    useUpdateEffect(() => {
        imgRef.current.classList.add(styles.fadein);
    }, [src]);

    if (!src) return null;

    const handleError = (e: any) => {
        e.target.src = fallback;
    };

    const handleLoad = (e: any) => {
        e.target.classList.remove(styles.fadein);
    };
    const imgRef = React.useRef<HTMLImageElement>();

    return (
        <img
            ref={imgRef}
            src={src}
            alt=""
            className={classnames(styles.fade, styles.fadein, className)}
            onLoad={handleLoad}
            onError={handleError}
        />
    );
};

export default FadeImage;
