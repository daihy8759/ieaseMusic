import { Button, CircularProgress, Typography } from '@material-ui/core';
import { ArrowBackSharp } from '@material-ui/icons';
import classnames from 'classnames';
import React, { useState } from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import styles from './index.module.less';
import AdapterLink from '/@/components/AdapterLink';
import { login, profileState } from '/@/stores/me';

const Legacy = () => {
    const { fm }: { fm: string } = useParams();
    const history = useHistory();
    const setProfile = useSetRecoilState(profileState);
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [showError, setShowError] = useState(false);
    const [waitingLogin, setWaitingLogin] = useState(false);

    const doLogin = async () => {
        if (!phone.trim() || !password.trim()) {
            setShowError(true);
            return;
        }
        setShowError(false);

        setWaitingLogin(true);
        try {
            const result = await login(phone, password);
            if (result) {
                if (result.cookie) {
                    setProfile(result);
                }
                history.replace(fm ? '/fm' : '/');
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
                <input
                    type="text"
                    value={phone}
                    placeholder="Your phone number"
                    onChange={(e) => setPhone(e.target.value)}
                />
                <input
                    type="password"
                    value={password}
                    onKeyPress={handleEnter}
                    placeholder="Password"
                    onChange={(e) => setPassword(e.target.value)}
                />
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
                    <Link to={`/login/qrcode/10/${fm}`} className={styles.link}>
                        Login with WeChat
                    </Link>

                    <Link to={`/login/qrcode/2/${fm}`} className={styles.link}>
                        Login with Weibo
                    </Link>
                </div>
            </footer>
        </div>
    );
};

export default Legacy;
