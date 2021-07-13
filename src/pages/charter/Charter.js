import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Button, FormControl, FormHelperText, FormLabel, Grid, IconButton, makeStyles, TextField, Typography } from '@material-ui/core';
import AlertDialog from '../../components/AlertDialog';
import { KeyboardDatePicker } from '@material-ui/pickers';
import { AddCircleOutline, RemoveCircleOutline } from '@material-ui/icons';

function AddTextFiels(props) {
  const { label, error, helperText, data, onAdd, onChange, onDelete } = props;

  return (
    <FormControl component="fieldset" fullWidth error={error} style={{ marginBottom: 10 }}>
      <FormLabel component="legend">{label} <IconButton onClick={onAdd} size="small"><AddCircleOutline /></IconButton></FormLabel>
      <Grid container direction="column" justify="flex-start" spacing={1} style={{ paddingLeft: 10 }}>
        {data.map((d, i) =>
          <Grid item key={"grid-" + i}>
            <TextField key={"field-" + i} id={i.toString()} name={i.toString()} fullWidth
              multiline
              value={d}
              onChange={onChange}
              variant="outlined"
              InputProps={{
                endAdornment:
                  <IconButton onClick={() => onDelete(i)} size="small">
                    <RemoveCircleOutline />
                  </IconButton>
              }}
              size="small"
            />
          </Grid>
        )}
      </Grid>
      < FormHelperText > {helperText}</FormHelperText>
    </FormControl>
  );
}

AddTextFiels.propTypes = {
  label: PropTypes.string,
  error: PropTypes.bool,
  helperText: PropTypes.string,
  data: PropTypes.array.isRequired,
  onAdd: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired
};

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
    margin: "auto",
    maxWidth: "100%",
  },
  textField: {
    margin: "6px 0px 6px 0px",
  },
  textFieldDisabled: {
    margin: "6px 0px 6px 0px",
    "& .MuiInputBase-root.Mui-disabled": {
      color: "rgba(0, 0, 0, 1)" // (default alpha is 0.38)
    }
  },
}));

const err = { error: true, text: "Tidak boleh kosong." };
const noErr = { error: false, text: "" };
const defaultError = { tanggalMulai: noErr, tanggalSelesai: noErr, tujuan: noErr, scope: noErr, target: noErr };

const defaultData = { nomor: "", namaProyek: "", nikBPO: "", nikPM: "", tanggalMulai: null, tanggalSelesai: null, tujuan: [""], scope: [""], target: [""] };

const defaultAlert = { openAlertDialog: false, messageAlertDialog: "", severity: "info" };

export default function Charter(props) {
  const { proyek } = props;
  const classes = useStyles();

  const [edit, setEdit] = useState(false);
  const [data, setData] = useState();
  const [tujuan, setTujuan] = useState([""]);
  const [scope, setScope] = useState([""]);
  const [target, setTarget] = useState([""]);
  const [error, setError] = useState(defaultError);
  const [alertDialog, setAlertDialog] = useState(defaultAlert);

  const handleCloseAlertDialog = () => {
    setAlertDialog({ ...alertDialog, openAlertDialog: false });
  };

  // set first data
  useEffect(() => {
    if (!data) {
      // get charter by id proyek from api
      // jika charter sudah ada datanya
      if (false) {
        setEdit(true);
        // diganti dengan data dari api
        setData("ganti dengan data dari response");
        setTujuan([""]);
        setScope([""]);
        setTarget([""]);
      } else { // jika belum ada charter
        setData(defaultData);
      }
    }
  }, [data, proyek]);

  const handleChangeDate = (value, jenis) => {
    setData(prev => ({ ...prev, [jenis]: value }));
    setError(prev => ({ ...prev, [jenis]: value ? noErr : err }));
  };

  const addTujuan = () => {
    let newArray = [...tujuan];
    newArray.push("");
    setTujuan(newArray);
  };

  const changeTujuan = (event) => {
    let newArray = [...tujuan];
    newArray[parseInt(event.target.name)] = event.target.value;
    setTujuan(newArray);
    setError(prev => ({ ...prev, tujuan: newArray.some(na => na) ? noErr : err }));
  };

  const deleteTujuan = (index) => {
    let newArray = [...tujuan];
    newArray.splice(index, 1);
    setTujuan(newArray);
  };

  const addScope = () => {
    let newArray = [...scope];
    newArray.push("");
    setScope(newArray);
  };

  const changeScope = (event) => {
    let newArray = [...scope];
    newArray[parseInt(event.target.name)] = event.target.value;
    setScope(newArray);
    setError(prev => ({ ...prev, scope: newArray.some(na => na) ? noErr : err }));
  };

  const deleteScope = (index) => {
    let newArray = [...scope];
    newArray.splice(index, 1);
    setScope(newArray);
  };

  const addTarget = () => {
    let newArray = [...target];
    newArray.push("");
    setTarget(newArray);
  };

  const changeTarget = (event) => {
    let newArray = [...target];
    newArray[parseInt(event.target.name)] = event.target.value;
    setTarget(newArray);
    setError(prev => ({ ...prev, target: newArray.some(na => na) ? noErr : err }));
  };

  const deleteTarget = (index) => {
    let newArray = [...target];
    newArray.splice(index, 1);
    setTarget(newArray);
  };

  const simpan = () => {
    console.log("simpan");
  };

  // console.log(proyek);
  return (
    <Grid container spacing={3} direction="column" >
      <AlertDialog
        open={alertDialog.openAlertDialog}
        id="alert-dialog"
        onClose={handleCloseAlertDialog}
        message={alertDialog.messageAlertDialog}
        severity={alertDialog.severity}
      />
      <Grid item>
        <Typography variant="h4" gutterBottom>
          {edit ? "Ubah Charter" : "Tambah Charter"}
        </Typography>
      </Grid>
      <Grid item container direction="row" justify="space-between" spacing={2}>
        <Grid item xs>
          <TextField id="nomor" label="Nomor Charter" fullWidth
            value={data ? data.nomor : ""}
            disabled
            variant="outlined"
            className={classes.textFieldDisabled}
          />
          <TextField id="namaProyek" label="Nama Proyek" fullWidth
            value={data ? data.namaProyek : ""}
            disabled
            variant="outlined"
            className={classes.textFieldDisabled}
          />
          <Grid container direction="row" spacing={2} justify="space-between">
            <Grid item xs>
              <TextField id="nikBPO" label="NIK BPO" fullWidth
                value={data ? data.nikBPO : ""}
                disabled
                variant="outlined"
                className={classes.textFieldDisabled}
              />
            </Grid>
            <Grid item xs>
              <TextField id="nikPM" label="NIK PM" fullWidth
                value={data ? data.nikPM : ""}
                disabled
                variant="outlined"
                className={classes.textFieldDisabled}
              />
            </Grid>
          </Grid>
          <Grid container direction="row" spacing={2} justify="space-between">
            <Grid item xs>
              <KeyboardDatePicker
                fullWidth
                clearable
                id="tanggalMulai"
                format="DD/MM/YYYY"
                label="Tanggal Mulai"
                value={data ? data.tanggalMulai : null}
                onChange={(value) => handleChangeDate(value, "tanggalMulai")}
                required
                error={error.tanggalMulai.error}
                helperText={error.tanggalMulai.text}
                // disabled={disabled}
                inputVariant="outlined"
                className={classes.textField}
                views={['year', 'month', 'date']}
              />
            </Grid>
            <Grid item xs>
              <KeyboardDatePicker
                fullWidth
                clearable
                id="tanggalSelesai"
                format="DD/MM/YYYY"
                label="Tanggal Selesai"
                value={data ? data.tanggalSelesai : null}
                onChange={(value) => handleChangeDate(value, "tanggalSelesai")}
                required
                error={error.tanggalSelesai.error}
                helperText={error.tanggalSelesai.text}
                // disabled={disabled}
                inputVariant="outlined"
                className={classes.textField}
                views={['year', 'month', 'date']}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs>
          <AddTextFiels label="Tujuan" error={error.tujuan.error} helperText={error.tujuan.text}
            data={tujuan} onAdd={addTujuan} onChange={changeTujuan} onDelete={deleteTujuan} />
          <AddTextFiels label="Ruang Lingkup" error={error.scope.error} helperText={error.scope.text}
            data={scope} onAdd={addScope} onChange={changeScope} onDelete={deleteScope} />
          <AddTextFiels label="Target / Hasil Capaian" error={error.target.error} helperText={error.target.text}
            data={target} onAdd={addTarget} onChange={changeTarget} onDelete={deleteTarget} />
        </Grid>
      </Grid>
      <Grid item container justify="flex-end">
        <Button onClick={simpan} color="primary" variant="contained" >
          {edit ? "Ubah" : "Simpan"}
        </Button>
      </Grid>
    </Grid >
  );
};