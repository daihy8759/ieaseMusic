import React, { Suspense } from 'react';
import * as ReactDOM from 'react-dom';
import { RecoilRoot } from 'recoil';
// import RecoilizeDebugger from 'recoilize';
import App from './App';
import Loader from './components/Loader';

const app = document.getElementById('app');

ReactDOM.render(
    <RecoilRoot>
        {/* <RecoilizeDebugger root={app} /> */}
        <Suspense fallback={<Loader />}>
            <App />
        </Suspense>
    </RecoilRoot>,
    app
);
