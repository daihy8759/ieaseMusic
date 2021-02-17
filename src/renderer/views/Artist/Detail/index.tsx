import classnames from 'classnames';
import React, { useState } from 'react';
import Albums from './Albums';
import Artists from './Artists';
import Desc from './Desc';
import styles from './index.module.less';
import Songs from './Songs';

const Detail = () => {
    const [tabKey, setTabKey] = useState('renderSongs');

    return (
        <div className={styles.body}>
            <header>
                <nav
                    onClick={() => setTabKey('renderSongs')}
                    className={classnames({
                        [styles.selected]: tabKey === 'renderSongs',
                    })}>
                    Top 50
                </nav>

                <nav
                    onClick={() => setTabKey('renderAlbums')}
                    className={classnames({
                        [styles.selected]: tabKey === 'renderAlbums',
                    })}>
                    专辑
                </nav>
                <nav
                    onClick={() => setTabKey('renderDesc')}
                    className={classnames({
                        [styles.selected]: tabKey === 'renderDesc',
                    })}>
                    歌手详情
                </nav>
                <nav
                    onClick={() => setTabKey('renderArtists')}
                    className={classnames({
                        [styles.selected]: tabKey === 'renderArtists',
                    })}>
                    相似歌手
                </nav>
            </header>

            <div className={styles.content}>
                {tabKey === 'renderSongs' && <Songs />}
                {tabKey === 'renderAlbums' && <Albums />}
                {tabKey === 'renderDesc' && <Desc />}
                {tabKey === 'renderArtists' && <Artists />}
            </div>
        </div>
    );
};

export default Detail;
