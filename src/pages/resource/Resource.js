import React, { useState, useEffect, useCallback } from 'react';
import { Grid, Typography, Button, TextField, IconButton, Paper, makeStyles, CircularProgress, Divider } from '@material-ui/core';
import { RemoveCircleOutline, AddCircleOutline } from '@material-ui/icons';
import AlertDialog from '../../components/AlertDialog';
import { updateResource, createResource } from '../../gateways/api/ResourceAPI';

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

const defaultData = { deskripsi: "", satuan: "", jumlah: "" };

const err = { error: true, text: "Tidak boleh kosong." };
const noErr = { error: false, text: "" };
const defaultError = { deskripsi: noErr, satuan: noErr, jumlah: noErr };

export default function Resource(props) {
  const { resource, proyek } = props;
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

  const formatNewData = useCallback((listdetail) => {
    const newData = [];
    listdetail.forEach(data => {
      newData.push({
        deskripsi: data.NAMARESOURCE,
        satuan: data.KODEUOM,
        jumlah: data.QUANTITY
      });
    });
    return newData;
  }, []);

  useEffect(() => {
    if (Object.keys(resource).length > 0) {
      setEdit(true);
      setNomor(resource.NORES);
      if (resource.LISTDETAIL.length > 0) {
        const newData = formatNewData(resource.LISTDETAIL);
        setData(newData);
        setError(newData.map(d => defaultError));
      } else {
        setData([defaultData]);
        setError([defaultError]);
      }
    } else {
      setData([defaultData]);
      setError([defaultError]);
    }
  }, [resource, formatNewData]);

  const validateLength10 = (value) => {
    if (value.length <= 10) return true;
    else return false;
  };

  const validateLength100 = (value) => {
    if (value.length <= 100) return true;
    else return false;
  };

  const handleChange = (value, index, key) => {
    let newArrayError = [...error];
    newArrayError[index] = { ...newArrayError[index], [key]: value ? noErr : err };
    setError(newArrayError);

    let newArray = [...data];
    if (key === "jumlah" && !isNaN(value) && (parseInt(value) < 1000 || !value) ? true
      : key === "deskripsi" && validateLength100(value) ? true
        : key === "satuan" && validateLength10(value) ? true
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
          deskripsi: data[i].deskripsi ? noErr : err,
          satuan: data[i].satuan ? noErr : err,
          jumlah: data[i].jumlah ? noErr : err
        };
        return newObj;
      })
    );
    if (data.every(dt => dt.deskripsi && dt.satuan && dt.jumlah)) return true;
    else return false;
  };

  const simpan = () => {
    setLoadingButton(true);
    if (data.length > 0) {
      if (validateAll()) {
        const listdetail = data.map(dt => ({
          namaresource: dt.deskripsi,
          kodeuom: dt.satuan,
          quantity: dt.jumlah,
        }));
        const formatData = {
          idproj: proyek.IDPROYEK,
          listdetail: listdetail
        };
        if (edit) {
          updateResource(formatData)
            .then((response) => {
              setData(formatNewData(response.data.LISTDETAIL));
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
          createResource(formatData)
            .then((response) => {
              setData(formatNewData(response.data.LISTDETAIL));
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
        // setTimeout(() => {
        //   console.log("simpan");
        //   console.log("format data", formatData);
        //   setLoadingButton(false);
        // }, 2000);
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
          {edit ? "Ubah Kebutuhan Sumber Daya" : "Tambah Kebutuhan Sumber Daya"}
        </Typography>
      </Grid>
      <Divider />
      <Grid item xs={6}>
        <TextField id="nomor"
          label="Nomor Kebutuhan Sumber Daya"
          fullWidth
          disabled
          className={classes.fieldDisabled}
          value={nomor}
        />
      </Grid>
      <Grid item >
        <Paper className={classes.paper}>
          <Grid container direction="column" spacing={2}>
            <Grid item container direction="row" justify="space-between">
              <Grid item xs>
                <Typography variant="h6">Sumber Daya Lain</Typography>
              </Grid>
            </Grid>
            <Grid item container direction="column" spacing={1}>
              <Grid item container direction="row" spacing={1} justify="space-between">
                <Grid item xs>
                  <Typography align="center" variant="body2"><b>Deskripsi Kebutuhan</b></Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography align="center" variant="body2"><b>Ukuran Satuan</b></Typography>
                </Grid>
                <Grid item xs={2}>
                  <Typography align="center" variant="body2"><b>Jumlah</b></Typography>
                </Grid>
                <Grid item xs={1}>
                  <Typography align="center" variant="body2"><b>Actions</b></Typography>
                </Grid>
              </Grid>
              {data && data.map((d, i) =>
                <Grid item key={"grid-cont-" + i} container direction="row" spacing={1} justify="space-between" alignItems="center">
                  <Grid key={"grid-deskripsi-" + i} item xs>
                    <TextField key={"deskripsi-" + i} id={"deskripsi-" + i} name={"deskripsi-" + i}
                      variant="outlined"
                      fullWidth
                      multiline
                      size="small"
                      value={d.deskripsi}
                      onChange={(event) => handleChange(event.target.value, i, "deskripsi")}
                      required
                      error={error[i].deskripsi.error}
                      helperText={error[i].deskripsi.text}
                    />
                  </Grid>
                  <Grid key={"grid-satuan-" + i} item xs={3}>
                    <TextField key={"satuan-" + i} id={"satuan-" + i} name={"satuan-" + i}
                      variant="outlined"
                      fullWidth
                      multiline
                      size="small"
                      value={d.satuan}
                      onChange={(event) => handleChange(event.target.value, i, "satuan")}
                      required
                      error={error[i].satuan.error}
                      helperText={error[i].satuan.text}
                    />
                  </Grid>
                  <Grid key={"grid-jumlah-" + i} item xs={2}>
                    <TextField key={"jumlah-" + i} id={"jumlah-" + i} name={"jumlah-" + i}
                      variant="outlined"
                      fullWidth
                      size="small"
                      value={d.jumlah}
                      onChange={(event) => handleChange(event.target.value, i, "jumlah")}
                      required
                      error={error[i].jumlah.error}
                      helperText={error[i].jumlah.text}
                      inputProps={{ style: { textAlign: 'right' } }}
                    />
                  </Grid>
                  <Grid item xs={1} container justify="center">
                    <IconButton size="small" onClick={() => deleteRow(i)}>
                      <RemoveCircleOutline />
                    </IconButton>
                  </Grid>
                </Grid>
              )}
              <Grid item xs container justify="center">
                <Button fullWidth aria-label="add row action plan" size="small" onClick={addRow} >
                  <AddCircleOutline />
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Paper>

      </Grid>
      <Divider />
      <Grid item container direction="row" justify="flex-end">
        <Button onClick={loadingButton ? null : simpan} variant="contained" color="primary">
          {loadingButton ? <CircularProgress size={20} color="inherit" /> : edit ? "Ubah" : "Simpan"}
        </Button>
      </Grid>
    </Grid>
  );
};
