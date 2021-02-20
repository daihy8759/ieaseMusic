import React, { FC } from 'react';
import { Link } from 'react-router-dom';
import { useRecoilValue, useRecoilValueLoadable } from 'recoil';
import styles from '../index.module.less';
import FadeImage from '/@/components/FadeImage';
import Loader from '/@/components/Loader';
import Artist from '/@/interface/Artist';
import IUserProfile from '/@/interface/IUserProfile';
import { songState } from '/@/stores/controller';
import { loginState } from '/@/stores/me';
import { fetchSimilarState } from '/@/stores/player';

interface PeopleProps {
    hasLogin: boolean;
    users: IUserProfile[];
    artists: Artist[];
}

const People: FC<PeopleProps> = (props) => {
    const { hasLogin, users, artists } = props;

    if (!hasLogin || (users.length === 0 && artists.length === 0)) {
        return <div className={styles.nothing}>Nothing ...</div>;
    }

    return (
        <>
            {users.length > 0 && (
                <div className={styles.users} key="users">
                    <h3>Listening history</h3>
                    {users.map((e: any, index: number) => {
                        return (
                            <Link className="clearfix tooltip" data-text={e.name} key={e.name + index} to={e.link}>
                                <FadeImage src={e.avatar} title={e.name} />
                            </Link>
                        );
                    })}
                </div>
            )}

            <div className={styles.artists} key="artists">
                <h3>Similar artist</h3>
                {artists.slice(0, users.length ? 5 : 10).map((e: Artist, index: number) => {
                    return (
                        <Link className="clearfix tooltip" data-text={e.name} key={e.name + index} to={e.link}>
                            <FadeImage src={e.avatar} title={e.name} />
                        </Link>
                    );
                })}
            </div>
        </>
    );
};

const PeopleLoadable = () => {
    const hasLogin = useRecoilValue(loginState);
    const song = useRecoilValue(songState);
    const peopleLoadable = useRecoilValueLoadable(
        fetchSimilarState({
            songId: song.id,
            artistId: song.artists ? song.artists[0].id : undefined,
        })
    );
    switch (peopleLoadable.state) {
        case 'hasValue':
            const { users, artists } = peopleLoadable.contents;
            return <People hasLogin={hasLogin} users={users} artists={artists} />;
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

export default PeopleLoadable;
