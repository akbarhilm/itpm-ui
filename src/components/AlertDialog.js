import React from 'react';
import PropTypes from 'prop-types';
import { Snackbar } from '@material-ui/core';
import { Alert } from '@material-ui/lab';

export default function AlertDialog(props) {
  const { onClose, message: messageProp, open, severity, ...other } = props;

  const handleClose = () => {
    onClose();
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={5000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      {...other}
    >
      <Alert onClose={handleClose} severity={severity} elevation={6} variant="filled">
        {messageProp}
      </Alert>
    </Snackbar>
  );
}

AlertDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  message: PropTypes.string.isRequired,
  severity: PropTypes.oneOf(['info', 'warning', 'success', 'error']).isRequired,
};
