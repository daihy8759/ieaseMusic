import { post } from 'utils/request';

export default query => {
    const path = `/weapi/v1/comment/${query.t}`;
    const type = {
        0: 'R_SO_4_', //  歌曲
        1: 'R_MV_5_', //  MV
        2: 'A_PL_0_', //  歌单
        3: 'R_AL_3_', //  专辑
        4: 'A_DJ_1_', //  电台,
        5: 'R_VI_62_', //  视频
        6: 'A_EV_2_' //  动态
    }[query.type];
    const data = {
        threadId: type + query.id,
        commentId: query.cid
    };
    if (query.type === 'A_EV_2_') {
        data.threadId = query.threadId;
    }
    return post(path, data);
};
