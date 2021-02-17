import classnames from 'classnames';
import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import styles from './index.module.less';
import { fetchArtistState } from '/@/stores/artist';

const Profile = () => {
    const { id }: { id: string } = useParams();
    const artist = useRecoilValue(fetchArtistState(parseInt(id)));
    const { profile } = artist;
    const { followed, size } = profile;

    // TODO follow
    const follow = (followed: boolean) => {};

    return (
        <>
            <p className={styles.name}>
                {profile.uid ? <Link to={`/user/${profile.uid}`}>{profile.name}</Link> : <span>{profile.name}</span>}
            </p>

            <div className={styles.meta}>
                <button
                    type="button"
                    className={classnames(styles.follow, {
                        [styles.followed]: followed,
                    })}
                    onClick={() => follow(followed)}>
                    {followed ? 'Followed' : 'Follow'}
                </button>

                <span>{size?.song} Tracks</span>

                <span>{size?.mv} MV</span>

                <span>{size?.album} Albums</span>
            </div>
        </>
    );
};

export default Profile;
