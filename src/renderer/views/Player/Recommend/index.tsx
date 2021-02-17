import classnames from 'classnames';
import React, { FC } from 'react';
import { Link } from 'react-router-dom';
import { useRecoilValue, useRecoilValueLoadable } from 'recoil';
import styles from './index.module.less';
import Loader from '/@/components/Loader';
import ProgressImage from '/@/components/ProgressImage';
import { songState } from '/@/stores/controller';
import { fetchRecommendState } from '/@/stores/player';

const recommendWidth = 260;
const recommendHeight = 230;

interface RecommendProps {
    list: any[];
}

const Recommend: FC<RecommendProps> = (props) => {
    const { list } = props;

    return (
        <div className={classnames('space-x-1 space-y-1', styles.recommend)}>
            <div
                style={{
                    position: 'relative',
                    display: 'inline-block',
                    height: recommendHeight / 3,
                    width: recommendWidth / 3,
                }}
                className="ml-1">
                {/* <div className={styles.play} onClick={() => play()}>
            {canToggle() && playing ? <PauseSharp /> : <PlayArrowSharp />}
        </div> */}
            </div>

            {list.map((e: any, index: number) => {
                return (
                    <Link className="clearfix" key={e.link + index} to={e.link}>
                        <ProgressImage
                            {...{
                                height: recommendHeight / 3,
                                width: recommendWidth / 3,
                                src: e.cover,
                            }}
                        />
                    </Link>
                );
            })}
        </div>
    );
};

const RecommendLoadable = () => {
    const song = useRecoilValue(songState);
    const recommendLoadable = useRecoilValueLoadable(fetchRecommendState(song.id));

    switch (recommendLoadable.state) {
        case 'hasValue':
            const { recommend } = recommendLoadable.contents;
            return <Recommend list={recommend} />;
        case 'loading':
            return <Loader />;
        case 'hasError':
            return (
                <div className={styles.placeholder}>
                    <span>Nothing ...</span>
                </div>
            );
    }
};

export default RecommendLoadable;
