import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { StoreProvider } from './context';

if (import.meta.env.MODE === 'development') {
    localStorage.debug = '*';
}

ReactDOM.render(
    <StoreProvider>
        <App />
    </StoreProvider>,
    document.getElementById('app')
);
