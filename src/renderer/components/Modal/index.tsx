import { Dialog, IconButton, Typography, Zoom } from '@material-ui/core';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';
import React, { FC, forwardRef } from 'react';

const styles = (theme: Theme) =>
    createStyles({
        root: {
            margin: 0,
            padding: theme.spacing(2),
        },
        closeButton: {
            position: 'absolute',
            right: theme.spacing(1),
            top: theme.spacing(1),
            color: theme.palette.grey[500],
        },
    });

const Transition = forwardRef(function Transition(props, ref) {
    return <Zoom ref={ref} {...props} />;
});

export interface DialogTitleProps extends WithStyles<typeof styles> {
    id: string;
    children: React.ReactNode;
    onCancel?: () => void;
}

const DialogTitle = withStyles(styles)((props: DialogTitleProps) => {
    const { children, classes, onCancel } = props;
    return (
        <MuiDialogTitle disableTypography className={classes.root}>
            <Typography variant="h6">{children}</Typography>
            {onCancel ? (
                <IconButton aria-label="close" className={classes.closeButton} onClick={onCancel}>
                    <CloseIcon />
                </IconButton>
            ) : null}
        </MuiDialogTitle>
    );
});

const DialogContent = withStyles(() => ({
    root: {},
}))(MuiDialogContent);

interface ModalProps {
    visible: boolean;
    title?: string;
    fullScreen?: boolean;
    content: React.ReactNode | string;
    onCancel?: () => void;
}

const Modal: FC<ModalProps> = (props) => {
    const { visible, title, content, fullScreen, onCancel } = props;
    return (
        <Dialog
            fullScreen={fullScreen}
            onClose={onCancel}
            TransitionComponent={Transition}
            aria-labelledby="customized-dialog-title"
            open={visible}>
            {title && (
                <DialogTitle id="customized-dialog-title" onCancel={onCancel}>
                    {title}
                </DialogTitle>
            )}
            <DialogContent>{content}</DialogContent>
        </Dialog>
    );
};

export default Modal;
