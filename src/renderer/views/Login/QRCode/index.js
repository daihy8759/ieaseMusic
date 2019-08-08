import FadeImage from 'components/FadeImage';
import { inject, observer } from 'mobx-react';
import React, { Component } from 'react';
import injectSheet from 'react-jss';
import { Link } from 'react-router-dom';
import QRCodeClasses from './classes';

@inject('me')
@observer
class QRCode extends Component {
    componentWillUnmount = () => clearInterval(this.timer);

    componentDidMount = () => this.refresh();

    async pleaseLogin() {
        const {
            me,
            history,
            match: { params }
        } = this.props;
        const { fm, type } = params;

        await me.generate(+type);
        me.waiting(() => {
            history.replace(+fm ? '/fm' : '/');
        });
    }

    tick() {
        clearInterval(this.timer);

        // 5 mins refresh QR Code
        this.timer = setInterval(() => {
            this.pleaseLogin();
        }, 5 * 60 * 1000);
    }

    refresh() {
        this.pleaseLogin();
        this.tick();
    }

    render() {
        const {
            classes,
            match,
            me: { qrcode }
        } = this.props;

        return (
            <div className={classes.container}>
                <Link className={classes.back} to={`/login/${+match.params.fm}`}>
                    <i className="remixicon-arrow-left-line" />
                    Login by Phone
                </Link>

                <header>
                    <h1>Sign in</h1>
                    <p>Hello there! Sign in and start playing with ieaseMusic &lt;3</p>
                </header>

                <figure>
                    <div className={classes.wraped}>
                        {qrcode.url ? (
                            <FadeImage className={classes.qrcode} src={qrcode.url} />
                        ) : (
                            <img alt="" className={classes.qrcode} src="assets/qrcode-placeholder.png" />
                        )}
                    </div>

                    <figcaption>
                        <p>Please use WeChat or Weibo to scan QR code to log in.</p>
                    </figcaption>

                    <a
                        href=""
                        onClick={e => {
                            e.preventDefault();
                            this.refresh();
                        }}>
                        Refresh
                    </a>
                </figure>
            </div>
        );
    }
}

export default injectSheet(QRCodeClasses)(QRCode);
