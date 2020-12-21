import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import React, { useRef } from 'react';
import { HashRouter } from 'react-router-dom';
import './App.less';
import ContextMenu from './components/ContextMenu';
import MainRouter from './routes';

const theme = createMuiTheme({
    palette: {},
});

const App = () => {
    const navigatorRef = useRef<any>();
    return (
        <HashRouter ref={navigatorRef}>
            <ContextMenu navigatorRef={navigatorRef} />
            <ThemeProvider theme={theme}>{MainRouter}</ThemeProvider>
        </HashRouter>
    );
};

export default App;
