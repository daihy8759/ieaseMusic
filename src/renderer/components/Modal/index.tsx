import classnames from 'classnames';
import * as React from 'react';
import { CSSTransition } from 'react-transition-group';
import { useKey } from 'react-use';
import './index.css';

interface ITransitionPortalProps {
    classNames?: string;
    timeout: number | { appear?: number; enter?: number; exit?: number };
}

const TransitionPortal: React.SFC<ITransitionPortalProps> = props => {
    const { children } = props;
    if (!children) {
        return <div />;
    }
    return (
        <div>
            <CSSTransition {...props}>{children}</CSSTransition>
        </div>
    );
};

interface IModalBodyProps {
    className?: string;
}

const ModalBody: React.SFC<IModalBodyProps> = props => {
    const { className, children } = props;

    return (
        <CSSTransition classNames="fade" timeout={{ enter: 1000, exit: 1000 }}>
            <div className={classnames('Modal-body', className)}>{children}</div>
        </CSSTransition>
    );
};

interface IModalHeaderProps {
    className?: string;
}

const ModalHeader: React.SFC<IModalHeaderProps> = props => {
    const { className, children } = props;
    return <div className={classnames('Modal-header', className)}>{children}</div>;
};

interface IModalProps {
    show: boolean;
    onCancel?: any;
}

const Modal: React.SFC<IModalProps> = props => {
    const handleEscKey = () => {
        const { show, onCancel } = props;
        if (show) {
            onCancel();
        }
    };

    const renderOverlay = () => {
        const { show, onCancel } = props;
        if (!show) {
            return <div />;
        }
        return <div className="Modal-overlay" onClick={onCancel} />;
    };

    const renderBody = () => {
        const { show, children } = props;
        if (!show) {
            return <div />;
        }

        return <div className="Modal-content">{children}</div>;
    };

    useKey('Esc', handleEscKey);

    const { show } = props;
    document.body.style.overflow = show ? 'hidden' : null;
    return (
        <div>
            <CSSTransition classNames="Modal-overlay" timeout={{ enter: 200, exit: 200 }}>
                {renderOverlay()}
            </CSSTransition>

            <TransitionPortal classNames="Modal-body" timeout={{ enter: 200, exit: 140 }}>
                {renderBody()}
            </TransitionPortal>
        </div>
    );
};

export { Modal, ModalBody, ModalHeader };
