import { createTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import React, { Suspense } from 'react';
import { HashRouter } from 'react-router-dom';
import './App.less';
import ContextMenu from './components/ContextMenu';
import MainRouter from './routes';

const theme = createTheme({
    palette: {},
});

const App = () => {
    return (
        <HashRouter>
            <Suspense fallback={null}>
                <ContextMenu />
            </Suspense>
            <ThemeProvider theme={theme}>{MainRouter}</ThemeProvider>
        </HashRouter>
    );
};

export default App;
