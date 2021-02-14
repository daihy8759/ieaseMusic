import type NeteaseCloudMusicApi from '@daihy8759/netease-cloud-music-api';
import _debug from 'debug';

type ProxyCloudMusicApi = typeof NeteaseCloudMusicApi & { callApi(name: string, args: any): Promise<any> };

const musicApi = (window as any).musicApi as ProxyCloudMusicApi;

const debug = _debug('dev:music');

function enableNoSuchMethod(obj: any) {
    return new Proxy(obj, {
        get(target, p: string) {
            if (p in target) {
                return target[p];
            } else {
                return async function (...args: any) {
                    const res = await musicApi.callApi(p, args);
                    debug('response: %s %o', p, res);
                    return res;
                };
            }
        },
    });
}

export function useMusicApi(): ProxyCloudMusicApi {
    return enableNoSuchMethod(musicApi);
}
