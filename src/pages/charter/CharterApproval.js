import React, { useState } from 'react';
import { Grid, Typography, Divider, Button, CircularProgress } from '@material-ui/core';
import CharterDetail from './CharterDetail';
import { getCharterByIdProyek } from '../../gateways/api/CharterAPI';
import AlertDialog from '../../components/AlertDialog';

const defaultAlert = { openAlertDialog: false, messageAlertDialog: "", severity: "info" };

export default function CharterApproval(props) {
  const { charter, proyek } = props;
  const [loadingButton, setLoadingButton] = useState(false);
  const [approved, setApproved] = useState(charter.KODEAPPROVE === "1");
  const [alertDialog, setAlertDialog] = useState(defaultAlert);

  const handleCloseAlertDialog = () => {
    setAlertDialog({ ...alertDialog, openAlertDialog: false });
  };

  const approve = () => {
    setLoadingButton(true);
    setTimeout(async () => {
      await getCharterByIdProyek("proyek.IDPROYEK")
        .then((response) => {
          setApproved(response.data.KODEAPPROVE === "1");
        });
      setAlertDialog({ openAlertDialog: true, messageAlertDialog: "Berhasil disetujui", severity: "success" });
      setLoadingButton(false);
    }, 2000);
  };

  return (
    <Grid container spacing={3} direction="column" >
      <AlertDialog
        open={alertDialog.openAlertDialog}
        id="alert-dialog"
        onClose={handleCloseAlertDialog}
        message={alertDialog.messageAlertDialog}
        severity={alertDialog.severity}
      />
      <Grid item xs>
        <Typography variant="h4" gutterBottom>
          {"Persetujuan Charter"}
        </Typography>
      </Grid>
      <Divider />
      <Grid item xs>
        <CharterDetail charter={charter} proyek={proyek} approval />
      </Grid>
      <Divider />
      <Grid item xs container justify="flex-end">
        <Button onClick={loadingButton ? null : approve} color="primary" variant="contained" >
          {loadingButton ? <CircularProgress size={20} color="inherit" /> : approved ? "Batal Setuju" : "Setuju"}
        </Button>
      </Grid>
    </Grid>
  );
}