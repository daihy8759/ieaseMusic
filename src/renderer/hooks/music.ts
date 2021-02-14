import type NeteaseCloudMusicApi from '@daihy8759/netease-cloud-music-api';

type ProxyCloudMusicApi = typeof NeteaseCloudMusicApi & { callApi(name: string, args: any): Promise<any> };

const musicApi = (window as any).musicApi as ProxyCloudMusicApi;

function enableNoSuchMethod(obj: any) {
    return new Proxy(obj, {
        get(target, p) {
            if (p in target) {
                return target[p];
            } else {
                return function (...args: any) {
                    return musicApi.callApi(p, args);
                };
            }
        },
    });
}

export function useMusicApi() {
    return enableNoSuchMethod(musicApi);
}
