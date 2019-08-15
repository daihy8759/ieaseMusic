import { useStore } from '@/context';
import * as qrcodePlaceholder from 'assets/qrcode-placeholder.png';
import FadeImage from 'components/FadeImage';
import { observer } from 'mobx-react-lite';
import * as React from 'react';
import { Link } from 'react-router-dom';
import * as styles from './index.less';

interface IQRCodeProps {
    history: any;
    match: any;
}

const QRCode: React.SFC<IQRCodeProps> = observer(props => {
    const { me } = useStore();
    let timer: number;
    const pleaseLogin = async () => {
        const {
            history,
            match: { params }
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
            <Link className={styles.back} to={`/login/${match.params.fm}`}>
                <i className="remixicon-arrow-left-line" />
                Login by Phone
            </Link>

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
                    onClick={e => {
                        e.preventDefault();
                        refresh();
                    }}>
                    Refresh
                </a>
            </figure>
        </div>
    );
});

export default QRCode;
