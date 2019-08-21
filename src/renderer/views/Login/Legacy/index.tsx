import { useStore } from '@/context';
import classnames from 'classnames';
import { observer } from 'mobx-react-lite';
import * as React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import * as styles from './index.less';

interface MatchParams {
    fm: string;
}

interface ILegacyProps extends RouteComponentProps<MatchParams> {}

const Legacy: React.FC<ILegacyProps> = observer(props => {
    const {
        me: { login, logining }
    } = useStore();
    const phoneRef = React.useRef<HTMLInputElement>();
    const passwordRef = React.useRef<HTMLInputElement>();
    const [showError, setShowError] = React.useState(false);

    const doLogin = async () => {
        const phone = phoneRef.current.value;
        const password = passwordRef.current.value;

        // Test phone and password not empty
        if (!phone.trim() || !password.trim()) {
            setShowError(true);
            return;
        }
        setShowError(false);

        const { history, match } = props;

        if (await login(phone, password)) {
            // Login success
            history.replace(+match.params.fm ? '/fm' : '/');
            return;
        }
        setShowError(true);
    };

    const handleEnter = async (e: any) => {
        if (e.charCode !== 13) {
            return;
        }
        doLogin();
    };

    const { match } = props;
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
                <input ref={phoneRef} type="text" placeholder="Your phone number" />
                <input onKeyPress={handleEnter} placeholder="Password" ref={passwordRef} type="password" />
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
                    onClick={doLogin}>
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
});

export default Legacy;
