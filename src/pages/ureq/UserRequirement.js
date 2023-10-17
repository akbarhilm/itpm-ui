import React, { useState, useEffect } from 'react';
import { Grid, Typography, Button, TextField, IconButton, Paper, makeStyles, Divider, CircularProgress } from '@material-ui/core';
import { RemoveCircleOutline, AddCircleOutline } from '@material-ui/icons';
import AlertDialog from '../../components/AlertDialog';
import { createUreq, updateUreq } from '../../gateways/api/UreqAPI';

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
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

const defaultAlert = { openAlertDialog: false, messageAlertDialog: "", severity: "info" };

const defaultData = { kebutuhan: "", rincian: "", useCase: "" };

const err = { error: true, text: "Tidak boleh kosong." };
const noErr = { error: false, text: "" };
const defaultError = { kebutuhan: noErr, rincian: noErr, useCase: noErr };

export default function UserRequirement(props) {
  const { ureq, proyek } = props;
  const classes = useStyles();
  const [loadingButton, setLoadingButton] = useState(false);
  const [edit, setEdit] = useState(false);
  const [nomor, setNomor] = useState("");
  const [data, setData] = useState();
  const [error, setError] = useState();
  const [alertDialog, setAlertDialog] = useState(defaultAlert);

  const handleCloseAlertDialog = () => {
    setAlertDialog({ ...alertDialog, openAlertDialog: false });
  };

  useEffect(() => {
    if (Object.keys(ureq).length > 0) {
      setEdit(true);
      let newData = [];
      let newError = [];
      ureq.LISTDETAIL.forEach(d => {
        newError.push(defaultError);
        newData.push({
          kebutuhan: d.NAMAUREQ,
          rincian: d.KETUREQ,
          useCase: d.USECASE
        });
      });
      setData(newData);
      setError(newError);
      setNomor(ureq.NOUREQ);
    } else {
      setData([defaultData]);
      setError([defaultError]);
    }
  }, [ureq]);

  const validateLength255 = (value) => {
    if (value.length <= 255) return true;
    else return false;
  };

  const validateLength150 = (value) => {
    if (value.length <= 150) return true;
    else return false;
  };

  const handleChange = (value, index, key) => {
    let newArrayError = [...error];
    newArrayError[index] = { ...newArrayError[index], [key]: value ? noErr : err };
    setError(newArrayError);

    let newArray = [...data];
    if (key === "rincian" ?
      validateLength255(value)
      : ["kebutuhan", "useCase"].includes(key) ?
        validateLength150(value)
        : false) {
      newArray[index] = { ...newArray[index], [key]: value };
      setData(newArray);
    }
  };

  const addRow = () => {
    let newArrayError = [...error];
    newArrayError.push(defaultError);
    setError(newArrayError);

    let newArray = [...data];
    newArray.push(defaultData);
    setData(newArray);
  };

  const deleteRow = (index) => {
    let newArrayError = [...error];
    newArrayError.splice(index, 1);
    setError(newArrayError);

    let newArray = [...data];
    newArray.splice(index, 1);
    setData(newArray);
  };

  const validateAll = () => {
    setError(prev =>
      prev.map((er, i) => {
        const newObj = {
          kebutuhan: data[i].kebutuhan ? noErr : err,
          rincian: data[i].rincian ? noErr : err,
          useCase: data[i].useCase ? noErr : err
        };
        return newObj;
      })
    );
    if (data.every(dt => dt.kebutuhan && dt.rincian && dt.useCase)) return true;
    else return false;
  };

  const simpan = () => {
    setLoadingButton(true);
    if (data.length > 0) {
      if (validateAll()) {
        const listdetail = data.map((dt, index) => ({
          namaureq: dt.kebutuhan,
          ketureq: dt.rincian,
          usecase: dt.useCase,
          prioritas: (index + 1)
        }));
        const formatData = {
          idproj: proyek.IDPROYEK,
          listdetail: listdetail
        };
        if (edit) {
          updateUreq(formatData)
            .then((response) => {
              setData(response.data.LISTDETAIL.map(d => ({ kebutuhan: d.NAMAUREQ, rincian: d.KETUREQ, useCase: d.USECASE })));
              setAlertDialog({ openAlertDialog: true, messageAlertDialog: "Berhasil ubah", severity: "success" });
              setLoadingButton(false);
            })
            .catch((error) => {
              setLoadingButton(false);
              if (error.response)
                setAlertDialog({ openAlertDialog: true, messageAlertDialog: error.response.data.message, severity: "error" });
              else
                setAlertDialog({ openAlertDialog: true, messageAlertDialog: error.message, severity: "error" });
            });
        } else {
          createUreq(formatData)
            .then((response) => {
              let newData = [];
              let newError = [];
              response.data.LISTDETAIL.forEach(d => {
                newError.push(defaultError);
                newData.push({
                  kebutuhan: d.NAMAUREQ,
                  rincian: d.KETUREQ,
                  useCase: d.USECASE
                });
              });
              setData(newData);
              setError(newError);
              setNomor(response.data.NOUREQ);
              setEdit(true);
              setAlertDialog({ openAlertDialog: true, messageAlertDialog: "Berhasil simpan", severity: "success" });
              setLoadingButton(false);
            })
            .catch((error) => {
              setLoadingButton(false);
              if (error.response)
                setAlertDialog({ openAlertDialog: true, messageAlertDialog: error.response.data.message, severity: "error" });
              else
                setAlertDialog({ openAlertDialog: true, messageAlertDialog: error.message, severity: "error" });
            });
        }
      } else {
        setAlertDialog({ openAlertDialog: true, messageAlertDialog: "Silahkan periksa data yang anda masukkan.", severity: "warning" });
        setLoadingButton(false);
      }
    } else {
      setAlertDialog({ openAlertDialog: true, messageAlertDialog: "Data kosong. Silahkan periksa data yang anda masukkan.", severity: "warning" });
      setLoadingButton(false);
    }
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
        <Typography variant="h4" gutterBottom>
          {edit ? "Ubah Kebutuhan Pengguna" : "Tambah Kebutuhan Pengguna"}
        </Typography>
      </Grid>
      <Divider />
      <Grid item xs={6}>
        <TextField id="nomor"
          label="Nomor Kebutuhan Pengguna"
          fullWidth
          disabled
          className={classes.fieldDisabled}
          value={nomor}
        />
      </Grid>
      <Grid item >
        <Paper className={classes.paper}>
          <Grid container direction="column" spacing={2}>
            <Grid item container direction="row" justifyContent="space-between">
              <Grid item xs>
                <Typography variant="h6">Data Requirement</Typography>
              </Grid>
            </Grid>
            <Grid item container direction="column" spacing={1}>
              <Grid item container direction="row" spacing={1} justifyContent="space-between">
                <Grid item xs={4}>
                  <Typography align="center" variant="body2"><b>Kebutuhan Sistem</b></Typography>
                </Grid>
                <Grid item xs={5}>
                  <Typography align="center" variant="body2"><b>Rincian Kebutuhan</b></Typography>
                </Grid>
                <Grid item xs={2}>
                  <Typography align="center" variant="body2"><b>Use Case</b></Typography>
                </Grid>
                <Grid item xs={1}>
                  <Typography align="center" variant="body2"><b>Actions</b></Typography>
                </Grid>
              </Grid>
              {data && data.map((d, i) =>
                <Grid item key={"grid-cont-" + i} container direction="row" spacing={1} justifyContent="space-between" alignItems="center">
                  <Grid key={"grid-kebutuhan-" + i} item xs={4}>
                    <TextField key={"kebutuhan-" + i} id={"kebutuhan-" + i} name={"kebutuhan-" + i}
                      variant="outlined"
                      fullWidth
                      multiline
                      size="small"
                      value={d.kebutuhan}
                      onChange={(event) => handleChange(event.target.value, i, "kebutuhan")}
                      required
                      error={error[i].kebutuhan.error}
                      helperText={error[i].kebutuhan.text}
                    />
                  </Grid>
                  <Grid key={"grid-rincian-" + i} item xs={5}>
                    <TextField key={"rincian-" + i} id={"rincian-" + i} name={"rincian-" + i}
                      variant="outlined"
                      fullWidth
                      multiline
                      size="small"
                      value={d.rincian}
                      onChange={(event) => handleChange(event.target.value, i, "rincian")}
                      required
                      error={error[i].rincian.error}
                      helperText={error[i].rincian.text}
                    />
                  </Grid>
                  <Grid key={"grid-use-case-" + i} item xs={2}>
                    <TextField key={"use-case-" + i} id={"use-case-" + i} name={"use-case-" + i}
                      variant="outlined"
                      fullWidth
                      size="small"
                      value={d.useCase}
                      onChange={(event) => handleChange(event.target.value, i, "useCase")}
                      required
                      error={error[i].useCase.error}
                      helperText={error[i].useCase.text}
                    />
                  </Grid>
                  <Grid item xs={1} container justifyContent="center">
                    <IconButton size="small" onClick={() => deleteRow(i)}>
                      <RemoveCircleOutline />
                    </IconButton>
                  </Grid>
                </Grid>
              )}
              <Grid item xs container justifyContent="center">
                <Button fullWidth aria-label="add row action plan" size="small" onClick={addRow} >
                  <AddCircleOutline />
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
      <Divider />
      <Grid item container direction="row" justifyContent="flex-end">
        <Button onClick={loadingButton ? null : simpan} variant="contained" color="primary">
          {loadingButton ? <CircularProgress size={20} color="inherit" /> : edit ? "Ubah" : "Simpan"}
        </Button>
      </Grid>
    </Grid>
  );
};
