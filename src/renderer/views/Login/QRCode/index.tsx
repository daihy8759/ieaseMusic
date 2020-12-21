import AdapterLink from '@/components/AdapterLink';
import IUserProfile from '@/interface/IUserProfile';
import { profileState } from '@/stores/me';
import { Button } from '@material-ui/core';
import { ArrowBackSharp } from '@material-ui/icons';
import QRCodeApi from 'api/qrcode';
import * as qrcodePlaceholder from 'assets/qrcode-placeholder.png';
import FadeImage from 'components/FadeImage';
import { dialog } from 'electron';
import React, { FC, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import storage from '../../../../shared/storage';
import Api from '../../../api';
import styles from './index.less';

interface MatchParams {
    fm: string;
    type: '10' | '2';
}

interface IQRCodeProps extends RouteComponentProps<MatchParams> {}

const QRCode: FC<IQRCodeProps> = (props) => {
    const [qrCode, setQrCode] = useState({ url: '', type: '' });
    const setProfile = useSetRecoilState(profileState);
    let timer: number;
    const pleaseLogin = async () => {
        const {
            match: { params },
        } = props;
        const { type } = params;
        const result = await QRCodeApi.generate(type);
        setQrCode({
            ...result,
            type,
        });
        const { ticket, state } = result;
        const data = await QRCodeApi.polling({
            ticket,
            state,
            type,
        });
        if (data.success === false) {
            dialog.showErrorBox(
                '错误',
                'Failed to login with QRCode, Please check your console(Press ⌘+⌥+I) and report it.'
            );
            return;
        }
        const { body } = await Api.login_status({});
        const profile = body.profile as IUserProfile;
        const userProfile = {
            ...profile,
            cookie: body.cookie,
        };
        storage.set('profile', userProfile);
        setProfile(userProfile);
        props.history.replace('/');
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
                    {qrCode.url ? (
                        <FadeImage className={styles.qrcode} src={qrCode.url} />
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
