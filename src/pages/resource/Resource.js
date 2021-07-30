import React, { useState, useEffect } from 'react';
import { Grid, Typography, Button, TextField, IconButton, Paper, makeStyles } from '@material-ui/core';
import { RemoveCircleOutline, AddCircleOutline } from '@material-ui/icons';
import AlertDialog from '../../components/AlertDialog';

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
  const { proyek } = props;
  const classes = useStyles();
  const [edit, setEdit] = useState(false);
  const [nomor, setNomor] = useState("");
  const [data, setData] = useState();
  const [error, setError] = useState();
  const [alertDialog, setAlertDialog] = useState(defaultAlert);

  const handleCloseAlertDialog = () => {
    setAlertDialog({ ...alertDialog, openAlertDialog: false });
  };

  useEffect(() => {
    // setListModul([]);
    if (!data) {
      // console.log(proyek);
      // get ureq then
      if (false) {
        setEdit(true);
        setData("response dari get ureq");
        setError("response dari get ureq di looping set defaultError");
        setNomor("set dari response");
      } else {
        setData([defaultData]);
        setError([defaultError]);
      }
    }
  }, [data, proyek]);

  const handleChange = (value, index, key) => {
    let newArrayError = [...error];
    newArrayError[index] = { ...newArrayError[index], [key]: value ? noErr : err };
    setError(newArrayError);

    let newArray = [...data];
    newArray[index] = { ...newArray[index], [key]: value };
    setData(newArray);
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

  const simpan = () => {
    console.log("simpan");
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
      <Grid item xs={6}>
        <TextField id="nomor"
          label="Nomor"
          variant="outlined"
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
                  <Typography align="center">Deskripsi Kebutuhan</Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography align="center">Ukuran Satuan</Typography>
                </Grid>
                <Grid item xs={2}>
                  <Typography align="center">Jumlah</Typography>
                </Grid>
                <Grid item xs={1}>
                  <Typography align="center">Actions</Typography>
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
      <Grid item container direction="row" justify="flex-end">
        <Button onClick={simpan} variant="contained" color="primary">
          {"Simpan"}
        </Button>
      </Grid>
    </Grid>
  );
};
