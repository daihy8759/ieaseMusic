import path from 'path';
import fs from 'fs';

function removeFile(path: string): Promise<void> {
    return new Promise((resolve) => {
        if (fs.existsSync(path)) {
            fs.unlink(path, () => {
                resolve();
            });
        } else {
            resolve();
        }
    });
}

export default {
    basename(p: string, ext?: string) {
        if (ext) {
            return path.basename(p, ext);
        }
        return path.basename(p);
    },
    async removeFiles(filenames: string[]) {
        await Promise.all(filenames.map((filename) => removeFile(filename)));
    },
    copyFile(source: string, dest: string) {
        return new Promise<void>((resolve, reject) => {
            fs.copyFile(source, dest, (err: any) => {
                if (err) {
                    reject();
                } else {
                    resolve();
                }
            });
        });
    },
};
