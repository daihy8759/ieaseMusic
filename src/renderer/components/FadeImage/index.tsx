import classnames from 'classnames';
import * as React from 'react';
import { useUpdateEffect } from 'react-use';
import * as styles from './index.less';

interface FadeImageProps {
    src: string;
    className?: string;
    fallback?: string;
    title?: string;
}

const FadeImage: React.SFC<FadeImageProps> = props => {
    const { src, className, fallback = 'https://source.unsplash.com/random' } = props;
    if (!src) return null;

    const handleError = (e: any) => {
        e.target.src = fallback;
    };

    const handleLoad = (e: any) => {
        e.target.classList.remove(styles.fadein);
    };

    const imgRef = React.useRef<HTMLImageElement>();

    useUpdateEffect(() => {
        imgRef.current.classList.add(styles.fadein);
    }, [src]);

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
