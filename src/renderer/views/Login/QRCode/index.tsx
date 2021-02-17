import { Button } from '@material-ui/core';
import { ArrowBackSharp } from '@material-ui/icons';
import React from 'react';
import { useParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import styles from './index.module.less';
import qrcodePlaceholder from '/@/assets/qrcode-placeholder.png';
import AdapterLink from '/@/components/AdapterLink';
import FadeImage from '/@/components/FadeImage';
import { generateQrcode } from '/@/stores/me';

interface MatchParams {
    fm: string;
    type: '10' | '2';
}

const QRCode = () => {
    const { fm, type }: MatchParams = useParams();
    const qrcode = useRecoilValue(generateQrcode(type));
    // const resetQrcodeUrl = useResetRecoilState(generateQrcode);

    let timer: number;
    const pleaseLogin = async () => {
        // await me.generate(type);
        // me.waiting(() => {
        //     history.replace(+fm ? '/fm' : '/');
        // });
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

    return (
        <div className={styles.container}>
            <Button className={styles.back} component={AdapterLink} to={`/login/${fm}`}>
                <ArrowBackSharp />
                Login by Phone
            </Button>

            <header>
                <h1>Sign in</h1>
                <p>Hello there! Sign in and start playing with ieaseMusic</p>
            </header>

            <figure>
                <div className={styles.wraped}>
                    {qrcode.url ? (
                        <FadeImage className={styles.qrcode} src={qrcode.url} />
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
