import { useEffect } from 'react';
import { useRecoilSnapshot } from 'recoil';
import _debug from 'debug';

const debug = _debug('dev:recoil');

function DebugObserver() {
    const snapshot = useRecoilSnapshot();
    useEffect(() => {
        debug('The following atoms were modified:');
        for (const node of snapshot.getNodes_UNSTABLE({ isModified: true })) {
            debug(node.key, snapshot.getLoadable(node));
        }
    }, [snapshot]);

    return null;
}

export default DebugObserver;
