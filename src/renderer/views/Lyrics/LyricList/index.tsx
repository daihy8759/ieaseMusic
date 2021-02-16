import classnames from 'classnames';
import React, { useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import styles from './index.module.less';
import { songState } from '/@/stores/controller';
import { fetchLyricState, lyricScrollTimeState } from '/@/stores/lyrics';

const LyricList = () => {
    const song = useRecoilValue(songState);
    const lyric = useRecoilValue(fetchLyricState(song.id));
    const { list: lyrics } = lyric;
    const scrollTimeKey = useRecoilValue(lyricScrollTimeState(lyrics));

    useEffect(() => {
        const lyricWrapper = document.getElementById('lyricWrapper');
        const playing = lyricWrapper?.querySelector(`[data-times='${scrollTimeKey}']`);
        if (playing) {
            playing.scrollIntoView();
        }
    }, [scrollTimeKey]);

    const renderLyrics = () => {
        const times = lyrics && Object.keys(lyrics);
        if (!times || times.length === 0) {
            return (
                <div className={styles.placeholder}>
                    <span>Nothing ...</span>
                </div>
            );
        }
        return times.map((e: string) => {
            return (
                <p data-times={e} key={e} className={classnames({ 'text-green-500': scrollTimeKey === e })}>
                    <span>{lyrics[e]}</span>
                </p>
            );
        });
    };

    return <>{renderLyrics()}</>;
};

export default LyricList;
