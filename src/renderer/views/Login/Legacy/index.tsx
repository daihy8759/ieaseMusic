import AdapterLink from '@/components/AdapterLink';
import { login, profileState } from '@/stores/me';
import { Button, CircularProgress, Typography } from '@material-ui/core';
import { ArrowBackSharp } from '@material-ui/icons';
import classnames from 'classnames';
import React, { FC, useRef, useState } from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import styles from './index.less';

interface MatchParams {
    fm: string;
}

interface ILegacyProps extends RouteComponentProps<MatchParams> {}

const Legacy: FC<ILegacyProps> = (props) => {
    const phoneRef = useRef<HTMLInputElement>();
    const passwordRef = useRef<HTMLInputElement>();
    const setProfile = useSetRecoilState(profileState);
    const [showError, setShowError] = useState(false);
    const [waitingLogin, setWaitingLogin] = useState(false);

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

        setWaitingLogin(true);
        try {
            const result = await login(phone, password);
            if (result) {
                if (result.cookie) {
                    setProfile(result);
                }
                history.replace(+match.params.fm ? '/fm' : '/');
            } else {
                setShowError(true);
            }
        } finally {
            setWaitingLogin(false);
        }
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
            <Button className={styles.back} component={AdapterLink} to="/">
                <ArrowBackSharp />
                Discover music
            </Button>

            <header>
                <h1>Sign in</h1>
                <p>Hello there! Sign in and start playing with ieaseMusic &lt;3</p>
            </header>
            <section>
                <input ref={phoneRef} type="text" placeholder="Your phone number" />
                <input onKeyPress={handleEnter} placeholder="Password" ref={passwordRef} type="password" />
                <p
                    className={classnames(styles.error, {
                        [styles.show]: showError,
                    })}>
                    Invalid username or password, Please try again.
                </p>
            </section>

            <footer>
                <Button variant="contained" disabled={waitingLogin} color="primary" onClick={doLogin}>
                    {waitingLogin ? (
                        <>
                            <CircularProgress size={14} />
                            <Typography>Logining...</Typography>
                        </>
                    ) : (
                        'Login'
                    )}
                </Button>

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
};

export default Legacy;
