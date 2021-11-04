import { useState } from "react";
import { Button, Divider, Grid, Typography } from "@material-ui/core";
import AlertDialog from "../../components/AlertDialog";
import ConfirmDialog from "../../components/ConfirmDialog";
import { createBast } from "../../gateways/api/BastAPI";

export default function BastAdd(props) {
  const { proyek, refresh } = props;
  const [disabledButton, setDisabledButton] = useState(false);
  const [alertDialog, setAlertDialog] = useState({ openAlertDialog: false, messageAlertDialog: "", severity: "info" });
  const [confirmDialog, setConfirmDialog] = useState({ openConfirmDialog: false, messageConfirmDialog: "", onConfirm: null, loading: false });

  const handleCloseAlertDialog = () => {
    setAlertDialog({ ...alertDialog, openAlertDialog: false });
  };

  const handleCloseConfirmDialog = () => {
    setConfirmDialog({ ...confirmDialog, openConfirmDialog: false });
  };

  const create = () => {
    setConfirmDialog(prev => ({ ...prev, loading: true }));
    createBast({ idproj: proyek.IDPROYEK })
      .then((response) => {
        setAlertDialog({ openAlertDialog: true, messageAlertDialog: "Berhasil simpan", severity: "success" });
        handleCloseConfirmDialog();
        setDisabledButton(true);
      })
      .catch((error) => {
        handleCloseConfirmDialog();
        if (error.response)
          setAlertDialog({ openAlertDialog: true, messageAlertDialog: error.response.data.message, severity: "error" });
        else
          setAlertDialog({ openAlertDialog: true, messageAlertDialog: error.message, severity: "error" });
      });
    // setTimeout(() => {
    //   console.log(proyek);
    //   setAlertDialog({ openAlertDialog: true, messageAlertDialog: "Berhasil simpan", severity: "success" });
    //   handleCloseConfirmDialog();
    //   setDisabledButton(true);
    // }, 2000);
  };

  const konfirmasi = () => {
    setConfirmDialog({
      openConfirmDialog: true,
      messageConfirmDialog: "Apakah Anda yakin membuat BAST (Berita Acara Serah Terima)?",
      onConfirm: create,
      loading: false
    });
  };

  return (
    <Grid container direction="column" spacing={2}>
      <AlertDialog
        open={alertDialog.openAlertDialog}
        id="alert-dialog"
        onClose={alertDialog.severity === "success" ? () => { handleCloseAlertDialog(); refresh(null); } : handleCloseAlertDialog}
        message={alertDialog.messageAlertDialog}
        severity={alertDialog.severity}
      />
      <ConfirmDialog
        open={confirmDialog.openConfirmDialog}
        id="confirm-dialog"
        keepMounted
        onClose={handleCloseConfirmDialog}
        message={confirmDialog.messageConfirmDialog}
        onConfirm={confirmDialog.onConfirm}
        loading={confirmDialog.loading}
      />

      <Grid item>
        <Typography variant="h4" gutterBottom>
          {"BAST (Berita Acara Serah Terima)"}
        </Typography>
      </Grid>
      <Divider />
      <Grid item>
        <Button onClick={konfirmasi} color="primary" variant="contained" disabled={disabledButton}>
          {"Buat BAST"}
        </Button>
      </Grid>
    </Grid>
  );
}