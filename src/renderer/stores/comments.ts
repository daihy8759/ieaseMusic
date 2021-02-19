import { atom, selectorFamily, useRecoilCallback, useRecoilValue } from 'recoil';
import { songState } from './controller';
import { getMusicComments, MusicComment } from '/@/api/comments';
import { useMusicApi } from '/@/hooks';

const namespace = 'comments';

const musicApi = useMusicApi();

const offsetState = atom<number>({
    key: `${namespace}:offset`,
    default: 0,
});

export const hotCommentsState = atom({
    key: `${namespace}:hotComments`,
    default: [] as MusicComment[],
});

export const newestCommentsState = atom({
    key: `${namespace}:newestComments`,
    default: [] as MusicComment[],
});

export const totalCommentState = selectorFamily({
    key: `${namespace}:totalComment`,
    get: (id: number) => async () => {
        if (!id) {
            return 0;
        }
        const data = await getMusicComments(id, 0);
        return data.total || 0;
    },
});

export function useFetchMoreComments() {
    const currentHotList = useRecoilValue(hotCommentsState);
    const currentNewestList = useRecoilValue(newestCommentsState);
    return useRecoilCallback(({ set, snapshot: { getPromise } }) => async (id: number) => {
        if (!id) {
            return;
        }
        const offset = await getPromise(offsetState);
        const data = await getMusicComments(id, offset);
        const { hotList, newestList, nextOffset } = data;
        set(hotCommentsState, currentHotList.concat(hotList));
        set(newestCommentsState, currentNewestList.concat(newestList));
        set(offsetState, nextOffset);
    });
}

export function useLikeComment() {
    return useRecoilCallback(({ set, snapshot: { getPromise } }) => async (commentId: number, liked: boolean) => {
        const song = await getPromise(songState);
        try {
            await musicApi.comment_like({
                id: song.id,
                type: 0,
                cid: commentId,
                t: liked ? 'like' : 'unlike',
            });
            const hotList = await getPromise(hotCommentsState);
            let index = hotList.findIndex((d) => d.commentId === commentId);
            if (index > -1) {
                hotList[index].liked = liked;
                set(hotCommentsState, hotList);
                return;
            }
            const newestList = await getPromise(newestCommentsState);
            index = newestList.findIndex((d) => d.commentId === commentId);
            if (index > -1) {
                newestList[index].liked = liked;
                set(newestCommentsState, newestList);
                return;
            }
        } catch (e) {}
    });
}
