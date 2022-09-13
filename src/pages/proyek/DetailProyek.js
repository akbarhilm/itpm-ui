import React, { useEffect, useState } from 'react';
import { Grid, Stepper, Step, StepLabel, makeStyles, Paper, Typography, TextField } from '@material-ui/core';
import { getProyekById, getStepperProyekById } from '../../gateways/api/ProyekAPI';
import { jenisLayanan, jenisAplikasi, labelStepper } from '../../utils/DataEnum';
import AlertDialog from '../../components/AlertDialog';

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
  },
  paperStepper: {
    padding: theme.spacing(2),
    color: theme.palette.text.secondary,
  },
  field: {
    margin: "6px 0px 6px 0px",
  },
  fieldDisabled: {
    margin: "6px 0px 6px 0px",
    "& .MuiInputBase-root.Mui-disabled": {
      color: "rgba(0, 0, 0, 1)" // (default alpha is 0.38)
    }
  },
}));

// const labelStepper = ["Charter", "User Requirement", "Rencana Pelaksanaan", "Kebutuhan Resource", "Kajian Risiko", "Realisasi", "UAT", "BAST"];

const defaultAlert = { openAlertDialog: false, messageAlertDialog: "", severity: "info" };

export default function DetailProyek(props) {
  const { proyek, setProyek } = props;
  const classes = useStyles();

  const [dataProyek, setDataProyek] = useState();
  const [stepper, setStepper] = useState();
  const [alertDialog, setAlertDialog] = useState(defaultAlert);

  const handleCloseAlertDialog = () => {
    setAlertDialog({ ...alertDialog, openAlertDialog: false });
  };

  useEffect(() => {
    if (!dataProyek) {
      getProyekById(proyek.IDPROYEK)
        .then((response) => {
          setDataProyek(response.data);
          setProyek(response.data);
        })
        .catch((error) => {
          if (error.response)
            setAlertDialog({ openAlertDialog: true, messageAlertDialog: error.response.data.message, severity: "error" });
          else
            setAlertDialog({ openAlertDialog: true, messageAlertDialog: error.message, severity: "error" });
        });
      getStepperProyekById(proyek.IDPROYEK)
        .then((response) => {
          setStepper(response.data);
        })
        .catch((error) => {
          if (error.response)
            setAlertDialog({ openAlertDialog: true, messageAlertDialog: error.response.data.message, severity: "error" });
          else
            setAlertDialog({ openAlertDialog: true, messageAlertDialog: error.message, severity: "error" });
        });
    }
  }, [dataProyek, proyek, setProyek]);

  const completeStepper = (data) => {
    if (data === "Charter") return stepper.NOCHARTER;
    else if (data === "User Requirement") return stepper.NOUREQ;
    else if (data === "Rencana Pelaksanaan") return stepper.NOPLAN;
    else if (data === "Kebutuhan Resource") return stepper.NORES;
    else if (data === "Kajian Risiko") return stepper.NORISK;
    else if (data === "Realisasi") return stepper.NOREAL;
    else if (data === "UAT") return stepper.NOUAT;
    else if (data === "BAST") return stepper.NOBA;
    else return false;
  };

  return (
    <Grid container direction="column" spacing={2}>
      <AlertDialog
        open={alertDialog.openAlertDialog}
        id="alert-dialog"
        onClose={handleCloseAlertDialog}
        message={alertDialog.messageAlertDialog}
        severity={alertDialog.severity}
      />
      <Grid item>
        <Paper className={classes.paperStepper}>
          <Stepper alternativeLabel activeStep={-1}>
            {labelStepper
              .map((d, index) => (
                <Step key={d} completed={stepper ? completeStepper(d) : false}>
                  <StepLabel>{d}</StepLabel>
                </Step>
              ))}
          </Stepper>
        </Paper>
      </Grid>
      <Grid item >
        <Grid container direction="column" spacing={4}>
          <Grid item >
            <Typography variant="h4" align="center">{dataProyek ? dataProyek.NAMAPROYEK : ""}</Typography>
            <Typography variant="body1" align="center">{dataProyek ? dataProyek.KETPROYEK : ""}</Typography>
          </Grid>
          <Grid item container direction="row" spacing={2} justify="space-between">
            <Grid item xs={6} container direction="column" >
              <TextField
                label="Nomor Layanan"
                // variant="outlined"
                className={classes.fieldDisabled}
                fullWidth
                disabled
                value={dataProyek && dataProyek.LAYANAN ? dataProyek.LAYANAN.NOLAYANAN : ""}
              />
              <Grid item container direction="row" spacing={2} justify="space-between">
                <Grid item xs>
                  <TextField
                    label="NIK BPO"
                    // variant="outlined"
                    className={classes.fieldDisabled}
                    fullWidth
                    disabled
                    value={dataProyek ? dataProyek.NIKREQ : ""}
                  />
                </Grid>
                <Grid item xs>
                  <TextField
                    label="NIK PM"
                    // variant="outlined"
                    className={classes.fieldDisabled}
                    fullWidth
                    disabled
                    value={dataProyek ? dataProyek.NIKPM : ""}
                  />
                </Grid>
              </Grid>
              <Grid item container direction="row" spacing={2} justify="space-between">
                <Grid item xs>
                  <TextField
                    label="Jenis Layanan"
                    // variant="outlined"
                    className={classes.fieldDisabled}
                    fullWidth
                    disabled
                    value={dataProyek && jenisLayanan.find(d => d.value === dataProyek.KODELAYANAN) ? jenisLayanan.find(d => d.value === dataProyek.KODELAYANAN).label : ""}
                  />
                </Grid>
                <Grid item xs>
                  <TextField
                    label="Jenis Aplikasi"
                    // variant="outlined"
                    className={classes.fieldDisabled}
                    fullWidth
                    disabled
                    value={dataProyek && jenisAplikasi.find(d => d.value === dataProyek.KODEAPLIKASI) ? jenisAplikasi.find(d => d.value === dataProyek.KODEAPLIKASI).label : ""}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Nama Aplikasi"
                // variant="outlined"
                className={classes.fieldDisabled}
                fullWidth
                disabled
                value={dataProyek && dataProyek.APLIKASI ? dataProyek.APLIKASI.NAMAAPLIKASI : "-"}
              />
              <TextField
                label="Nama Modul"
                // variant="outlined"
                className={classes.fieldDisabled}
                fullWidth
                disabled
                value={dataProyek && dataProyek.MODUL ? dataProyek.MODUL.NAMAMODUL : "-"}
              />

            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}