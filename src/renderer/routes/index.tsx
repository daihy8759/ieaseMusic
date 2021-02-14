import Loader from '/@/components/Loader';
import React from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import Layout from '../views/Layout';
import Welcome from '../views/Welcome';

const { Suspense } = React;

const Main = withRouter((props: any) => <Layout {...props} />);

const LoginByLegacy = React.lazy(() => import('../views/Login/Legacy'));
const LoginByQrCode = React.lazy(() => import('../views/Login/QrCode'));
const Player = React.lazy(() => import('../views/Player'));
const User = React.lazy(() => import('../views/User'));
const Artist = React.lazy(() => import('../views/Artist'));
const Top = React.lazy(() => import('../views/Top'));
const Playlist = React.lazy(() => import('../views/Playlist'));
const Singleton = React.lazy(() => import('../views/Singleton'));
const Comments = React.lazy(() => import('../views/Comments'));
const Lyrics = React.lazy(() => import('../views/Lyrics'));
const Search = React.lazy(() => import('../views/Search'));
const FM = React.lazy(() => import('../views/FM'));

function LazyComponent(Component: any) {
    return (props: any) => (
        <Suspense fallback={<Loader show />}>
            <Component {...props} />
        </Suspense>
    );
}

const MainRouter = (
    <Main>
        <Switch>
            <Route exact path="/" component={Welcome} />
            <Route exact path="/login/:fm" component={LazyComponent(LoginByLegacy)} />
            <Route exact path="/login/qrcode/:type/:fm" component={LazyComponent(LoginByQrCode)} />
            <Route exact path="/player/:type/:id" component={LazyComponent(Player)} />
            <Route exact path="/user/:id" component={LazyComponent(User)} />
            <Route exact path="/artist/:id" component={LazyComponent(Artist)} />
            <Route exact path="/top" component={LazyComponent(Top)} />
            <Route exact path="/playlist/:type" component={LazyComponent(Playlist)} />
            <Route exact path="/singleton" component={LazyComponent(Singleton)} />
            <Route exact path="/comments" component={LazyComponent(Comments)} />
            <Route exact path="/lyrics" component={LazyComponent(Lyrics)} />
            <Route exact path="/search" component={LazyComponent(Search)} />
            <Route exact path="/fm" component={LazyComponent(FM)} />
        </Switch>
    </Main>
);

export default MainRouter;
