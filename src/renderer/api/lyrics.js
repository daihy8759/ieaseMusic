import lyric from './common/lyric';

async function getLyric(id) {
    const result = {};
    try {
        const res = await lyric({ id });
        if (res.data.code === 200) {
            const { data } = res;
            if (data.lrc === undefined) {
                return result;
            }
            const lyrics = data.lrc.lyric.split('\n');
            lyrics.forEach(e => {
                const match = e.match(/\[.+\]/);

                if (!match) {
                    return;
                }

                const timestamp = match[0]
                    .replace(/\D/g, ':')
                    .replace(/^:|:$/g, '')
                    .split(':');
                const content = e.replace(/\[.+\]/, '');
                const times =
                    parseInt(+timestamp[0] * 60 * 1000, 10) +
                    parseInt(+timestamp[1] * 1000, 10) +
                    parseInt(timestamp[2], 10);

                result[times] = content;
            });
        }
    } catch (e) {
        console.error(e);
    }
    return result;
}

export default getLyric;
