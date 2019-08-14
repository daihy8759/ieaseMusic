import songLike from './common/like';
import tracksOp from './common/playlist_tracks';
import userDetail from './common/user_detail';
import userPlayList from './common/user_playlist';

async function getUser(uid: number) {
    try {
        const res = await userDetail({ uid });
        const { data } = res;
        if (data.code !== 200) {
            throw data;
        }
        const { profile } = data;
        return {
            id: profile.userId,
            name: profile.nickname,
            signature: profile.signature,
            avatar: profile.avatarUrl,
            followed: profile.followed,
            followers: profile.followeds,
            following: profile.follows
        };
    } catch (e) {
        console.error(e);
    }
    return {};
}

async function getPlayList(uid: number) {
    try {
        const res = await userPlayList({ uid });
        const { data } = res;
        if (data.code !== 200) {
            throw data;
        }
        return data.playlist.map((e: any) => ({
            id: e.id.toString(),
            name: e.name,
            cover: e.coverImgUrl,
            played: e.playCount,
            size: e.trackCount,
            link: `/player/0/${e.id}`
        }));
    } catch (e) {
        console.error(e);
    }
    return [];
}

async function getUserDetail(uid: number) {
    const [profile, playlists] = await Promise.all([getUser(uid), getPlayList(uid)]);
    return {
        profile,
        playlists
    };
}

async function likeSong(id: number, like: boolean) {
    try {
        const res = await songLike({ id, like });
        return res.data;
    } catch (e) {
        console.error(e);
    }
    return { code: 301 };
}

async function unlikeSong(pid: number, songId: number) {
    try {
        const res = await tracksOp({ op: 'del', pid, tracks: songId });
        return res.data;
    } catch (e) {
        console.error(e);
    }
    return { code: 301 };
}

export { getUserDetail, likeSong, unlikeSong };
