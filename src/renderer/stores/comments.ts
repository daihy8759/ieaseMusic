import { getMusicComments } from '/@/api/comments';
import { selectorFamily } from 'recoil';

export const fetchListState = selectorFamily({
    key: 'fetchCommentList',
    get: (id: number) => async () => {
        if (!id) {
            return {
                hotList: [],
                newestList: [],
                total: 0,
                nextOffset: 0,
            };
        }
        const data = await getMusicComments(id);
        return {
            hotList: data.hotList || [],
            newestList: data.newestList || [],
            total: data.total || 0,
            nextOffset: data.nextOffset,
        };
    },
});
