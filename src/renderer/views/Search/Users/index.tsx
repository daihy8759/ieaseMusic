import React, { FC } from 'react';
import { Link } from 'react-router-dom';
import { useRecoilValueLoadable } from 'recoil';
import styles from '../index.module.less';
import Loader from '/@/components/Loader';
import ProgressImage from '/@/components/ProgressImage';
import IUserProfile from '/@/interface/IUserProfile';
import { usersQueryState } from '/@/stores/search';

interface UsersProps {
    users: IUserProfile[];
}

const Users: FC<UsersProps> = (props) => {
    const { users } = props;

    if (users.length === 0) {
        return (
            <div className={styles.placeholder}>
                <span>Nothing ...</span>
            </div>
        );
    }

    return (
        <div className="flex justify-start flex-wrap space-x-1 space-y-1">
            {users.map((e: any) => {
                return (
                    <div key={e.link} className="w-28 h-28">
                        <Link to={e.link}>
                            <img className="w-16 h-16 rounded-full mx-auto mb-1" src={e.avatar} />
                        </Link>

                        <div className="bg-black text-xs p-1 text-center truncate rounded-lg">{e.name}</div>
                    </div>
                );
            })}
        </div>
    );
};

const UsersLoadable = () => {
    const usersLoadable = useRecoilValueLoadable(usersQueryState);

    switch (usersLoadable.state) {
        case 'hasValue':
            const users = usersLoadable.contents;
            return <Users users={users} />;
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

export default UsersLoadable;
