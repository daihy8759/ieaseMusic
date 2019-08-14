import classnames from 'classnames';
import * as React from 'react';
import * as styles from './index.less';

interface FadeImageProps {
    src: string;
    className: string;
    fallback: string;
}

function FadeImage({ src, className, fallback = 'https://source.unsplash.com/random' }: FadeImageProps) {
    if (!src) return null;

    const handleError = (e: any) => {
        e.target.src = fallback;
    };

    const handleLoad = (e: any) => {
        e.target.classList.remove(styles.fadein);
    };

    const imgRef = React.useRef();

    React.useEffect(() => {
        imgRef.current!.classList.add(styles.fadein);
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
}

export default FadeImage;
