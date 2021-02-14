interface Store {
    set(key: string, value: any): Promise<void>;
    get(key: string): Promise<any>;
    delete(key: string): Promise<any>;
}

const storage = (window as any).storage as Store;

export function useStorage() {
    return {
        set(key: string, value: any) {
            return storage.set(key, value);
        },
        get(key: string) {
            return storage.get(key);
        },
        delete(key: string) {
            return storage.delete(key);
        },
    };
}
