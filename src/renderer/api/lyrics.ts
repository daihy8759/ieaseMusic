import Api from './';

async function getLyric(id: number) {
    if (!id) {
        return;
    }
    const result: any = {};
    try {
        const { body } = await Api.lyric({ id });
        if (body.code === 200) {
            const { lrc } = body;
            if (lrc === undefined) {
                return result;
            }
            // @ts-ignore
            const lyrics = lrc.lyric.split('\n');
            lyrics.forEach((e: any) => {
                const match = e.match(/\[.+\]/);

                if (!match) {
                    return;
                }

                const timestamp = match[0]
                    .replace(/\D/g, ':')
                    .replace(/^:|:$/g, '')
                    .split(':');
                if (!timestamp[0]) {
                    return;
                }
                const content = e.replace(/\[.+\]/, '');
                const times =
                    parseInt(timestamp[0]) * 60 * 1000 + parseInt(timestamp[1]) * 1000 + parseInt(timestamp[2]);

                result[times] = content;
            });
        }
    } catch (e) {
        console.error(e);
    }
    return result;
}

export default getLyric;
