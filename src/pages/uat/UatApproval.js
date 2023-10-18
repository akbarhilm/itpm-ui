import React, { useContext, useState } from 'react';
import { Grid, Typography, Divider, Button, CircularProgress, Dialog, DialogContent, TextField, DialogActions } from '@material-ui/core';
import AlertDialog from '../../components/AlertDialog';
import UatDetail from './UatDetail';
import { approveUser } from '../../gateways/api/UatAPI';
import { UserContext } from '../../utils/UserContext';

const defaultAlert = { openAlertDialog: false, messageAlertDialog: "", severity: "info" };

export default function UatApproval(props) {
  const { uat, onClose, refresh } = props;
  const { karyawan } = useContext(UserContext);
  const [loadingButton, setLoadingButton] = useState(false);
  const [loadingButtonDialog, setLoadingButtonDialog] = useState(false);
  const [statusApprove, setStatusApprove] = useState(uat.APROVEUSER);
  const [alertDialog, setAlertDialog] = useState(defaultAlert);
  const [keterangan, setKeterangan] = useState("");
  const [error, setError] = useState({ error: false, text: "" });
  const [openDialogTidakSetuju, setOpenDialogTidakSetuju] = useState(false);

  const handleCloseAlertDialog = () => {
    setAlertDialog({ ...alertDialog, openAlertDialog: false });
  };

  const handleCloseDialogTidakSetuju = () => {
    setOpenDialogTidakSetuju(false);
    setKeterangan("");
    setError({ error: false, text: "" });
  };


  const approve = () => {
    setLoadingButton(true);
    const data = {
      iduat: uat.IDUAT,
      kodeaprove: "1",
      ketaprove: ""
    };
    approved(data);
  };

  const notApprove = () => {
    setLoadingButtonDialog(true);
    if (keterangan) {
      const data = {
        iduat: uat.IDUAT,
        kodeaprove: "2",
        ketaprove: keterangan
      };
      approved(data);
    } else {
      setAlertDialog({ openAlertDialog: true, messageAlertDialog: "Silahkan periksa data yang anda masukkan.", severity: "warning" });
      setLoadingButtonDialog(false);
      setError({ error: true, text: "Tidak boleh kosong." });
    }
  };

  const approved = (data) => {
    approveUser(data)
      .then((response) => {
        setStatusApprove(data.kodeaprove);
        setAlertDialog({ openAlertDialog: true, messageAlertDialog: "Berhasil simpan", severity: "success" });
        setLoadingButton(false);
        setLoadingButtonDialog(false);
        handleCloseDialogTidakSetuju();
        refresh();
      })
      .catch((error) => {
        setLoadingButton(false);
        setLoadingButtonDialog(false);
        if (error.response)
          setAlertDialog({ openAlertDialog: true, messageAlertDialog: error.response.data.message, severity: "error" });
        else
          setAlertDialog({ openAlertDialog: true, messageAlertDialog: error.message, severity: "error" });
      });
  };

  return (
    <Grid container spacing={3} direction="column" >
      <AlertDialog
        open={alertDialog.openAlertDialog}
        id="alert-dialog"
        onClose={alertDialog.severity === "success" ? () => { handleCloseAlertDialog(); onClose(); } : handleCloseAlertDialog}
        message={alertDialog.messageAlertDialog}
        severity={alertDialog.severity}
      />
      <Grid item xs>
        <Typography variant="h4" gutterBottom>
          {"Persetujuan Uat"}
        </Typography>
      </Grid>
      <Divider />
      <Grid item xs>
        <UatDetail uat={uat} karyawan={karyawan} approval />
      </Grid>
      <Divider />
      {statusApprove !== "1" && <Grid item xs container justify="flex-end">
        <Button onClick={loadingButton ? null : approve} color="primary" variant="contained" >
          {loadingButton ? <CircularProgress size={20} color="inherit" /> : "Setuju"}
        </Button>
        {statusApprove === "0" && <Button onClick={() => setOpenDialogTidakSetuju(true)} color="secondary" variant="contained" style={{ marginLeft: 10 }} >
          {"Tidak Setuju"}
        </Button>}
      </Grid>}
      <Dialog open={openDialogTidakSetuju} onClose={handleCloseDialogTidakSetuju} aria-labelledby="form-dialog-title">
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="keterangan"
            label="Keterangan"
            fullWidth
            multiline
            rows={3}
            onChange={(event) => {
              setKeterangan(event.target.value ? event.target.value : "");
              setError(event.target.value ? { error: false, text: "" } : { error: true, text: "Tidak boleh kosong." });
            }}
            value={keterangan}
            variant="outlined"
            error={error.error}
            helperText={error.text}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={loadingButtonDialog ? null : notApprove} color="primary" variant="contained" >
            {loadingButtonDialog ? <CircularProgress size={20} color="inherit" /> : "Simpan"}
          </Button>
          <Button onClick={handleCloseDialogTidakSetuju} color="inherit" variant="contained">
            Batal
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
}