import artist from './artist';
import comments from './comments';
import controller from './controller';
import fm from './fm';
import home from './home';
import lyrics from './lyrics';
import me from './me';
import menu from './menu';
import player from './player';
import playing from './playing';
import playlist from './playlist';
import preferences from './preferences';
import search from './search';
import share from './share';
import top from './top';
import upnext from './upnext';
import user from './user';

export function createStore() {
    return {
        me,
        controller,
        preferences,
        home,
        upnext,
        comments,
        lyrics,
        share,
        menu,
        playing,
        player,
        top,
        search,
        artist,
        playlist,
        user,
        fm
    };
}

export type TStore = ReturnType<typeof createStore>;
