import React from 'react';
import ReactDOM from 'react-dom';
import { RecoilRoot } from 'recoil';
// import RecoilizeDebugger from 'recoilize';
import DebugObserver from './DebugObserver';
import App from './App';

const isDev = import.meta.env.MODE === 'development';

if (isDev) {
    localStorage.debug = '*';
}

const app = document.getElementById('app');

ReactDOM.render(
    <RecoilRoot>
        {/* TODO: post promise object /*}
        {/* {isDev && <RecoilizeDebugger root={app} />} */}
        {isDev && <DebugObserver />}
        <App />
    </RecoilRoot>,
    app
);
