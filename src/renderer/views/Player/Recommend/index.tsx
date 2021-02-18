import { PauseSharp, PlayArrowSharp } from '@material-ui/icons';
import classnames from 'classnames';
import React, { FC } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useRecoilState, useRecoilValue, useRecoilValueLoadable } from 'recoil';
import { MatchParams } from '..';
import styles from './index.module.less';
import Loader from '/@/components/Loader';
import ProgressImage from '/@/components/ProgressImage';
import { playingState, playListState, songState, useTogglePlayList } from '/@/stores/controller';
import { fetchListDetailState, fetchRecommendState } from '/@/stores/player';

const recommendWidth = 260;
const recommendHeight = 230;

interface RecommendProps {
    list: any[];
}

const Recommend: FC<RecommendProps> = (props) => {
    const { list } = props;
    const [playing, setPlaying] = useRecoilState(playingState);
    const playList = useRecoilValue(playListState);
    const togglePlaylist = useTogglePlayList();
    const { id, type }: MatchParams = useParams();
    const listDetail = useRecoilValue(fetchListDetailState({ id, type }));
    const { meta, songs } = listDetail;

    const play = () => {
        const currentPlayId = playList.id;
        const sameToPlaying = currentPlayId && currentPlayId === meta.id;
        if (sameToPlaying) {
            setPlaying(!playing);
        } else {
            togglePlaylist({
                playList: {
                    id: meta.id,
                    link: `/player/${meta.type}/${meta.id}`,
                    name: meta.name,
                    songs,
                },
            });
        }
    };

    const canToggle = () => {
        return playList.id === meta.id;
    };

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
                <div className={styles.play} onClick={() => play()}>
                    {canToggle() && playing ? <PauseSharp /> : <PlayArrowSharp />}
                </div>
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
