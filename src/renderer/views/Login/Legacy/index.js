import classnames from 'classnames';
import { inject } from 'mobx-react';
import React, { Component } from 'react';
import injectSheet from 'react-jss';
import { Link } from 'react-router-dom';
import LegacyClasses from './classes';

@inject(stores => ({
    login: stores.me.login,
    logining: stores.me.logining
}))
class Legacy extends Component {
    state = {
        showError: false
    };

    constructor(props) {
        super(props);
        this.phone = React.createRef();
        this.password = React.createRef();
    }

    async doLogin() {
        const phone = this.phone.current.value;
        const password = this.password.current.value;

        // Test phone and password not empty
        if (!phone.trim() || !password.trim()) {
            this.setState({
                showError: true
            });

            return;
        }

        this.setState({
            showError: false
        });

        const { login, history, match } = this.props;

        if (await login(phone, password)) {
            // Login success
            history.replace(+match.params.fm ? '/fm' : '/');
            return;
        }

        // Login failed
        this.setState({
            showError: true
        });
    }

    async handleEnter(e) {
        if (e.charCode !== 13) {
            return;
        }

        this.doLogin();
    }

    render() {
        const { classes, logining, match } = this.props;
        const { showError } = this.state;
        return (
            <div className={classes.container}>
                <Link className={classes.back} to="/">
                    <i className="remixicon-arrow-left-line" />
                    Discover music
                </Link>

                <header>
                    <h1>Sign in</h1>
                    <p>Hello there! Sign in and start playing with ieaseMusic &lt;3</p>
                </header>
                <section>
                    <input ref={this.phone} type="text" placeholder="Your phone number" />
                    <input
                        onKeyPress={e => this.handleEnter(e)}
                        placeholder="Password"
                        ref={this.password}
                        type="password"
                    />
                    <p
                        className={classnames(classes.error, {
                            [classes.show]: showError
                        })}>
                        Invalid username or password, Please try again.
                    </p>
                </section>

                <footer>
                    <button
                        className={classnames({
                            [classes.logining]: logining
                        })}
                        disabled={logining}
                        type="button"
                        onClick={e => this.doLogin()}>
                        <span>{logining ? 'Logining...' : 'Login'}</span>
                    </button>

                    <div className={classes.sns}>
                        <Link to={`/login/qrcode/10/${+match.params.fm}`} className={classes.link}>
                            Login with WeChat
                        </Link>

                        <Link to={`/login/qrcode/2/${+match.params.fm}`} className={classes.link}>
                            Login with Weibo
                        </Link>
                    </div>
                </footer>
            </div>
        );
    }
}

export default injectSheet(LegacyClasses)(Legacy);
