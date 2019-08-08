import PropTypes from 'prop-types';
import React, { Component } from 'react';
import injectSheet from 'react-jss';
import OfflineClasses from './classes';

class Offline extends Component {
    static propTypes = {
        show: PropTypes.bool.isRequired
    };

    state = {
        offline: false
    };

    componentDidMount() {
        window.addEventListener('offline', () => {
            this.setState({
                offline: true
            });
        });

        window.addEventListener('online', () => {
            this.setState({
                offline: false
            });
        });
    }

    render() {
        const { classes, show } = this.props;
        const { offline } = this.state;
        if (!show) {
            return false;
        }
        if (!offline) {
            return (
                <div className={classes.container}>
                    <h1>Opps, seems like you are offline...</h1>
                </div>
            );
        }
    }
}

export default injectSheet(OfflineClasses)(Offline);
