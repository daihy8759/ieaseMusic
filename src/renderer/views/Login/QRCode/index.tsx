import { Button } from '@material-ui/core';
import { ArrowBackSharp } from '@material-ui/icons';
import React, { FC } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import styles from './index.module.less';
import * as qrcodePlaceholder from '/@/assets/qrcode-placeholder.png';
import AdapterLink from '/@/components/AdapterLink';
import FadeImage from '/@/components/FadeImage';

interface MatchParams {
    fm: string;
    type: '10' | '2';
}

const QRCode: FC<RouteComponentProps<MatchParams>> = (props) => {
    let timer: number;
    const pleaseLogin = async () => {
        const {
            history,
            match: { params },
        } = props;
        const { fm, type } = params;

        await me.generate(type);
        me.waiting(() => {
            history.replace(+fm ? '/fm' : '/');
        });
    };

    const tick = () => {
        clearInterval(timer);
        timer = window.setInterval(() => {
            pleaseLogin();
        }, 5 * 60 * 1000);
    };

    const refresh = () => {
        pleaseLogin();
        tick();
    };

    const { match } = props;
    return (
        <div className={styles.container}>
            <Button className={styles.back} component={AdapterLink} to={`/login/${match.params.fm}`}>
                <ArrowBackSharp />
                Login by Phone
            </Button>

            <header>
                <h1>Sign in</h1>
                <p>Hello there! Sign in and start playing with ieaseMusic &lt;3</p>
            </header>

            <figure>
                <div className={styles.wraped}>
                    {me.qrcode.url ? (
                        <FadeImage className={styles.qrcode} src={me.qrcode.url} />
                    ) : (
                        <img alt="" className={styles.qrcode} src={qrcodePlaceholder} />
                    )}
                </div>

                <figcaption>
                    <p>Please use WeChat or Weibo to scan QR code to log in.</p>
                </figcaption>

                <a
                    href=""
                    onClick={(e) => {
                        e.preventDefault();
                        refresh();
                    }}>
                    Refresh
                </a>
            </figure>
        </div>
    );
};

export default QRCode;
