import classnames from 'classnames';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { CSSTransition } from 'react-transition-group';
import './index.css';

const { Component, PureComponent } = React;

function on(el: any, events: string, fn: any) {
    if (el && events && fn) {
        events.split(',').forEach(e => {
            el.addEventListener(e, fn, false);
        });
    }
}

function off(el: any, events: string, fn: any) {
    if (el && events && fn) {
        events.split(',').forEach(e => {
            el.removeEventListener(e, fn, false);
        });
    }
}

interface ITransitionPortalProps {
    classNames?: string;
    timeout: number | { appear?: number; enter?: number; exit?: number };
}

class TransitionPortal extends Component<ITransitionPortalProps, {}> {
    ele: HTMLDivElement;

    componentDidMount() {
        this.ele = document.createElement('div');
        document.body.appendChild(this.ele);
        this.componentDidUpdate();
    }

    componentDidUpdate() {
        const { children } = this.props;
        if (children) {
            ReactDOM.render(<CSSTransition {...this.props}>{children}</CSSTransition>, this.ele);
        }
    }

    componentWillUnmount() {
        document.body.removeChild(this.ele);
    }

    // @ts-ignore
    render() {
        return null;
    }
}

interface IModalBodyProps {
    className?: string;
}

class ModalBody extends PureComponent<IModalBodyProps, {}> {
    render() {
        const { className, children } = this.props;

        return (
            <CSSTransition classNames="fade" timeout={{ enter: 1000, exit: 1000 }}>
                <div className={classnames('Modal-body', className)}>{children}</div>
            </CSSTransition>
        );
    }
}

interface IModalHeaderProps {
    className?: string;
}

class ModalHeader extends PureComponent<IModalHeaderProps, any> {
    render() {
        const { className, children } = this.props;
        return <div className={classnames('Modal-header', className)}>{children}</div>;
    }
}

interface IModalProps {
    show: boolean;
    onCancel?: any;
}

class Modal extends Component<IModalProps, {}> {
    componentDidMount() {
        this.handleEscKey = this.handleEscKey.bind(this);
        on(document, 'keydown', this.handleEscKey);
    }

    componentWillUnmount() {
        off(document, 'keydown', this.handleEscKey);
    }

    handleEscKey(e: any) {
        const { show, onCancel } = this.props;
        if (e.keyCode === 27 && show) {
            onCancel();
        }
    }

    renderOverlay() {
        const { show, onCancel } = this.props;
        if (!show) {
            return <div />;
        }

        return <div className="Modal-overlay" onClick={onCancel} />;
    }

    renderBody() {
        const { show, children } = this.props;
        if (!show) {
            return <div />;
        }

        return <div className="Modal-content">{children}</div>;
    }

    render() {
        const { show } = this.props;
        document.body.style.overflow = show ? 'hidden' : null;

        return (
            <div>
                <CSSTransition classNames="Modal-overlay" timeout={{ enter: 200, exit: 200 }}>
                    {this.renderOverlay()}
                </CSSTransition>

                <TransitionPortal classNames="Modal-body" timeout={{ enter: 200, exit: 140 }}>
                    {this.renderBody()}
                </TransitionPortal>
            </div>
        );
    }
}

export { Modal, ModalBody, ModalHeader };
