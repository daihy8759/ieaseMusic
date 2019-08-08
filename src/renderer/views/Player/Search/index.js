import closePng from 'assets/close.png';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import injectSheet from 'react-jss';
import SearchClasses from './classes';

class Search extends Component {
    static propsTypes = {
        show: PropTypes.bool.isRequired,
        close: PropTypes.func.isRequired
    };

    pressEscExit(e) {
        const { close } = this.props;
        if (e.keyCode === 27) {
            close();
        }
    }

    render() {
        const { classes, show, close, filter, children } = this.props;

        if (!show) {
            return false;
        }

        return (
            <div className={classes.container} onKeyUp={e => this.pressEscExit(e)}>
                <header>
                    <input type="text" onInput={e => filter(e.target.value)} placeholder="Search..." />
                    <img alt="Close" className={classes.close} onClick={close} src={closePng} />
                </header>

                <div className={classes.list}>{children}</div>
            </div>
        );
    }
}

export default injectSheet(SearchClasses)(Search);
