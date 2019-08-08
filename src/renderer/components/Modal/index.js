import classnames from 'classnames';
import PropTypes from 'prop-types';
import React, { Component, PureComponent } from 'react';
import ReactDOM from 'react-dom';
import CSSTransition from 'react-transition-group/CSSTransitionGroup';
import './index.css';

function on(el, events, fn) {
    if (el && events && fn) {
        events.split().forEach(e => {
            el.addEventListener(e, fn, false);
        });
    }
}

function off(el, events, fn) {
    if (el && events && fn) {
        events.split().forEach(e => {
            el.removeEventListener(e, fn, false);
        });
    }
}

class TransitionPortal extends Component {
    ele;

    componentDidMount() {
        this.ele = document.createElement('div');
        document.body.appendChild(this.ele);
        this.componentDidUpdate();
    }

    componentDidUpdate() {
        const { children } = this.props;
        ReactDOM.render(<CSSTransition {...this.props}>{children}</CSSTransition>, this.ele);
    }

    componentWillUnmount() {
        document.body.removeChild(this.ele);
    }

    render() {
        return null;
    }
}

class ModalBody extends PureComponent {
    render() {
        const { className, children } = this.props;

        return (
            <CSSTransition transitionName="fade" transitionEnterTimeout={1000} transitionLeaveTimeout={1000}>
                <div className={classnames('Modal-body', className)}>{children}</div>
            </CSSTransition>
        );
    }
}

class ModalHeader extends PureComponent {
    render() {
        const { className, children } = this.props;
        return <div className={classnames('Modal-header', className)}>{children}</div>;
    }
}

class Modal extends Component {
    static propTypes = {
        show: PropTypes.bool,
        onCancel: PropTypes.func
    };

    static defaultProps = {
        show: false,
        onCancel: () => {}
    };

    componentDidMount() {
        this.handleEscKey = this.handleEscKey.bind(this);
        on(document, 'keydown', this.handleEscKey);
    }

    componentWillUnmount() {
        off(document, 'keydown', this.handleEscKey);
    }

    handleEscKey(e) {
        const { show, onCancel } = this.props;
        if (e.keyCode === 27 && show) {
            onCancel();
        }
    }

    renderOverlay() {
        const { show, onCancel } = this.props;
        if (!show) {
            return;
        }

        return <div className="Modal-overlay" onClick={onCancel} />;
    }

    renderBody() {
        const { show, children } = this.props;
        if (!show) {
            return;
        }

        return <div className="Modal-content">{children}</div>;
    }

    render() {
        const { show } = this.props;
        document.body.style.overflow = show ? 'hidden' : null;

        return (
            <div>
                <CSSTransition transitionName="Modal-overlay" transitionEnterTimeout={200} transitionLeaveTimeout={200}>
                    {this.renderOverlay()}
                </CSSTransition>

                <TransitionPortal transitionName="Modal-body" transitionEnterTimeout={200} transitionLeaveTimeout={140}>
                    {this.renderBody()}
                </TransitionPortal>
            </div>
        );
    }
}

export { Modal, ModalBody, ModalHeader };
