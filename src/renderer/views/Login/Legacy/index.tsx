import classnames from 'classnames';
import IStore from 'interface/IStore';
import { inject } from 'mobx-react';
import * as React from 'react';
import { Link } from 'react-router-dom';
import * as styles from './index.less';

interface ILegacyProps {
    logining: boolean;
    login: any;
    history: any;
    match: any;
}

@inject((stores: IStore) => ({
    login: stores.me.login,
    logining: stores.me.logining
}))
class Legacy extends React.Component<ILegacyProps, {}> {
    state = {
        showError: false
    };
    private phoneRef = React.createRef<HTMLInputElement>();
    private passwordRef = React.createRef<HTMLInputElement>();

    async doLogin() {
        const phone = this.phoneRef.current.value;
        const password = this.passwordRef.current.value;

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

    async handleEnter(e: any) {
        if (e.charCode !== 13) {
            return;
        }

        this.doLogin();
    }

    render() {
        const { logining, match } = this.props;
        const { showError } = this.state;
        return (
            <div className={styles.container}>
                <Link className={styles.back} to="/">
                    <i className="remixicon-arrow-left-line" />
                    Discover music
                </Link>

                <header>
                    <h1>Sign in</h1>
                    <p>Hello there! Sign in and start playing with ieaseMusic &lt;3</p>
                </header>
                <section>
                    <input ref={this.phoneRef} type="text" placeholder="Your phone number" />
                    <input
                        onKeyPress={e => this.handleEnter(e)}
                        placeholder="Password"
                        ref={this.passwordRef}
                        type="password"
                    />
                    <p
                        className={classnames(styles.error, {
                            [styles.show]: showError
                        })}>
                        Invalid username or password, Please try again.
                    </p>
                </section>

                <footer>
                    <button
                        className={classnames({
                            [styles.logining]: logining
                        })}
                        disabled={logining}
                        type="button"
                        onClick={e => this.doLogin()}>
                        <span>{logining ? 'Logining...' : 'Login'}</span>
                    </button>

                    <div className={styles.sns}>
                        <Link to={`/login/qrcode/10/${+match.params.fm}`} className={styles.link}>
                            Login with WeChat
                        </Link>

                        <Link to={`/login/qrcode/2/${+match.params.fm}`} className={styles.link}>
                            Login with Weibo
                        </Link>
                    </div>
                </footer>
            </div>
        );
    }
}

export default Legacy;
