import Api from './';

async function getUser(uid: number, cookie?: string) {
    try {
        const { body } = await Api.user_detail({ uid, cookie });
        if (body.code !== 200) {
            throw body;
        }
        const profile = body;
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

async function getPlayList(uid: number, cookie?: string) {
    try {
        const { body } = await Api.user_playlist({ uid, cookie });
        if (body.code !== 200) {
            throw body;
        }
        const playlist: any = body.playlist;
        return playlist.map((e: any) => ({
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

async function getUserDetail(uid: number, cookie?: string) {
    const [profile, playlists] = await Promise.all([getUser(uid, cookie), getPlayList(uid, cookie)]);
    return {
        profile,
        playlists
    };
}

export { getUserDetail };
