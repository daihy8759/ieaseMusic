import path from 'path';

export default {
    basename(p: string, ext?: string) {
        if (ext) {
            return path.basename(p, ext);
        }
        return path.basename(p);
    },
};
