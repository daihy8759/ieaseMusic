import { remote } from 'electron';

const NeteaseCloudMusicApi: typeof import('NeteaseCloudMusicApi') = remote.require('NeteaseCloudMusicApi');

export default NeteaseCloudMusicApi;
