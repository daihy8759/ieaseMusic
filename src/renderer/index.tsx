import React from 'react';
import ReactDOM from 'react-dom';
import { RecoilRoot } from 'recoil';
import App from './App';
import DebugObserver from './DebugObserver';

const isDev = import.meta.env.MODE === 'development';

if (isDev) {
    localStorage.debug = '*';
}

ReactDOM.render(
    <RecoilRoot>
        {isDev && <DebugObserver />}
        <App />
    </RecoilRoot>,
    document.getElementById('app')
);
