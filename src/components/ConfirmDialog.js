import React from 'react';
import PropTypes from 'prop-types';
import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  dialog: {
    position: 'absolute',
    left: '50%-width',
    top: 20,
    padding: theme.spacing(1)
  }
}));

export default function ConfirmDialog(props) {
  const classes = useStyles();
  const { onClose, onConfirm, message: messageProp, open, loading, ...other } = props;

  const handleCancel = () => {
    onClose();
  };

  const handleOk = () => {
    onConfirm();
  };

  return (
    <Dialog
      disableBackdropClick
      disableEscapeKeyDown
      maxWidth="xs"
      aria-labelledby="confirmation-dialog-title"
      open={open}
      classes={{
        paper: classes.dialog,
      }}
      {...other}
    >
      <DialogTitle id="confirmation-dialog-title">Konfirmasi</DialogTitle>
      <DialogContent>
        {messageProp}
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleCancel} color="inherit" variant="contained" style={{ height: 37 }}>
          {"Tidak"}
        </Button>
        <Button onClick={loading ? null : handleOk} color="primary" variant="contained" style={{ height: 37, width: 50 }}>
          {loading ? <CircularProgress size={20} color="inherit" /> : "Ya"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

ConfirmDialog.propTypes = {
  onConfirm: PropTypes.func,
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  message: PropTypes.string.isRequired,
  loading: PropTypes.bool
};
