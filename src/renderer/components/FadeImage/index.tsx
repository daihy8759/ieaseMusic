import classnames from 'classnames';
import React, { FC, useEffect, useState } from 'react';

interface FadeImageProps {
    src?: string;
    className?: string;
    fallback?: string;
    title?: string;
}

const FadeImage: FC<FadeImageProps> = (props) => {
    const { src, className, fallback = 'https://source.unsplash.com/random' } = props;
    const [fade, setFade] = useState(false);

    useEffect(() => {
        setFade(true);
    }, [src]);

    if (!src) return null;

    const handleError = (e: any) => {
        e.target.src = fallback;
    };

    const handleLoad = () => {
        setFade(false);
    };

    return (
        <img
            src={src}
            alt=""
            className={classnames(
                {
                    'animate-pulse': fade,
                },
                className
            )}
            onLoad={handleLoad}
            onError={handleError}
        />
    );
};

export default FadeImage;
