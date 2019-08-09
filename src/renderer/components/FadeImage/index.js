import React, { Component } from 'react';
import PropTypes from 'prop-types';
import injectSheet from 'react-jss';
import classnames from 'classnames';
import FadeImageClasses from './classes';

class FadeImage extends Component {
    static propTypes = {
        src: PropTypes.string,
        fallback: PropTypes.string
    };

    static defaultProps = {
        src: '',
        fallback: 'https://source.unsplash.com/random'
    };

    constructor(props) {
        super(props);
        this.image = React.createRef();
    }

    componentDidUpdate(prevProps) {
        const ele = this.image.current;
        const { src, classes } = this.props;

        if (ele && src !== prevProps.src) {
            ele.classList.add(classes.fadein);
        }
    }

    handleError(e) {
        const { fallback } = this.props;
        e.target.src = fallback;
    }

    handleLoad(e) {
        const {
            classes: { fadein }
        } = this.props;
        e.target.classList.remove(fadein);
    }

    render() {
        const { classes, className, src } = this.props;

        if (!src) return false;

        return (
            <img
                ref={this.image}
                src={src}
                alt=""
                className={classnames(classes.fade, classes.fadein, className)}
                onLoad={e => this.handleLoad(e)}
                onError={e => this.handleError(e)}
            />
        );
    }
}

export default injectSheet(FadeImageClasses)(FadeImage);
