import React, { FC } from 'react';
import { Link } from 'react-router-dom';
import helper from '/@/utils/helper';
import styles from './index.module.less';

interface PlaylistMetaProps {
    meta: any;
}

const PlaylistMeta: FC<PlaylistMetaProps> = (props) => {
    const { meta } = props;
    return (
        <summary className={styles.summary}>
            <p className={styles.title}>
                <span>{meta.name}</span>
            </p>

            <p className={styles.author}>
                <span>
                    {meta.author.map((e: any, index: number) => {
                        return (
                            <Link key={e.name + index} to={e.link}>
                                {e.name}
                            </Link>
                        );
                    })}
                </span>
            </p>

            <p
                className={styles.subtitle}
                style={{
                    marginTop: 20,
                }}>
                <span>{meta.company || `${helper.humanNumber(meta.played)} Played`}</span>
            </p>
        </summary>
    );
};

export default PlaylistMeta;
