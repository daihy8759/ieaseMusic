interface IO {
    basename: (filename: string, ext?: string) => string;
}

const io = (window as any).io as IO;

export function useIO() {
    return io;
}
