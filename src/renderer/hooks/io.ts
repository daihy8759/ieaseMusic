interface IO {
    basename: (filename: string, ext?: string) => string;
    removeFiles: (filenames: string[]) => Promise<void>;
    copyFile: (source: string, dest: string) => Promise<void>;
}

const io = (window as any).io as IO;

export function useIO() {
    return io;
}
