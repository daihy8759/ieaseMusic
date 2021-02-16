import React from 'react';
import { useRecoilValue } from 'recoil';
import styles from './index.module.less';
import { progressBufferTimeState, songState } from '/@/stores/controller';

// TODO cpu use age
const Progress = () => {
    const song = useRecoilValue(songState);
    const { duration } = song;
    const progressBuffer = useRecoilValue(progressBufferTimeState);

    const seek = (e: any) => {
        const percent = e.clientX / window.innerWidth;
        if (duration) {
            const time = duration * percent;
            const audioEle = document.querySelector('audio');
            audioEle && (audioEle.currentTime = time / 1000);
        }
    };

    return (
        <div id="progress" className={styles.bar} onClick={seek}>
            <div
                className={styles.playing}
                data-time={progressBuffer?.time}
                style={{
                    transform: `translate3d(${-100 + progressBuffer.percent * 100}%, 0, 0)`,
                }}
            />
            <div className={styles.buffering} />
        </div>
    );
};

export default Progress;
