import React, { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Button, CircularProgress, FormControl, FormHelperText, FormLabel, Grid, IconButton, makeStyles, TextField, Typography, Divider } from '@material-ui/core';
import AlertDialog from '../../components/AlertDialog';
import { KeyboardDatePicker } from '@material-ui/pickers';
import { AddCircleOutline, RemoveCircleOutline } from '@material-ui/icons';
import moment from 'moment';
import { createCharter, updateCharter } from '../../gateways/api/CharterAPI';

function AddTextFiels(props) {
  const { required, label, error, helperText, data, onAdd, onChange, onDelete } = props;

  return (
    <FormControl required={required} component="fieldset" fullWidth error={error} style={{ marginBottom: 10 }}>
      <FormLabel component="legend">{label} <IconButton onClick={onAdd} size="small"><AddCircleOutline /></IconButton></FormLabel>
      <Grid container direction="column" justify="flex-start" spacing={1} >
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

const defaultData = { nomor: "", tanggalMulai: null, tanggalSelesai: null, tujuan: [""], scope: [""], target: [""] };

const defaultAlert = { openAlertDialog: false, messageAlertDialog: "", severity: "info" };

export default function Charter(props) {
  const { charter, proyek } = props;
  const classes = useStyles();

  const [edit, setEdit] = useState(false);
  const [loadingButton, setLoadingButton] = useState(false);
  const [data, setData] = useState();
  const [tujuan, setTujuan] = useState([""]);
  const [scope, setScope] = useState([""]);
  const [target, setTarget] = useState([""]);
  const [error, setError] = useState(defaultError);
  const [alertDialog, setAlertDialog] = useState(defaultAlert);

  const handleCloseAlertDialog = () => {
    setAlertDialog({ ...alertDialog, openAlertDialog: false });
  };

  const formatDataCharter = useCallback((data) => {
    return {
      idcharter: data.IDCHARTER,
      nomor: data.NOCHARTER,
      tanggalMulai: moment(data.TGLMULAI, "DD/MM/YYYY"),
      tanggalSelesai: moment(data.TGLSELESAI, "DD/MM/YYYY"),
      tujuan: data.TUJUAN,
      scope: data.SCOPE,
      target: data.TARGET
    };

  }, []);

  // set first data
  useEffect(() => {
    if (Object.keys(charter).length > 0) {
      const newData = formatDataCharter(charter);
      setEdit(true);
      setData(newData);
      setTujuan(newData.tujuan.sort((a, b) => a.KODESORT - b.KODESORT).map(d => d.KETERANGAN));
      setScope(newData.scope.sort((a, b) => a.KODESORT - b.KODESORT).map(d => d.KETERANGAN));
      setTarget(newData.target.sort((a, b) => a.KODESORT - b.KODESORT).map(d => d.KETERANGAN));
    } else { // jika belum ada charter
      setData(defaultData);
    }
  }, [charter, formatDataCharter]);

  const handleChangeDate = (value, jenis) => {
    setError(prev => ({ ...prev, [jenis]: value ? noErr : err }));
    if (jenis === "tanggalMulai")
      setData(prev => ({ ...prev, [jenis]: value, tanggalSelesai: value < prev.tanggalSelesai ? prev.tanggalSelesai : null }));
    else
      setData(prev => ({ ...prev, [jenis]: value }));
  };

  const validateLength500 = (value) => {
    if (value.length <= 500) return true;
    else return false;
  };

  const addTujuan = () => {
    let newArray = [...tujuan];
    newArray.push("");
    setTujuan(newArray);
  };

  const changeTujuan = (event) => {
    let newArray = [...tujuan];
    if (validateLength500(event.target.value)) {
      newArray[parseInt(event.target.name)] = event.target.value;
      setTujuan(newArray);
      setError(prev => ({ ...prev, tujuan: newArray.some(na => na) ? noErr : err }));
    } else if (!newArray[parseInt(event.target.name)]) {
      setError(prev => ({ ...prev, tujuan: { error: true, text: "Tidak boleh lebih dari 500 karakter." } }));
    }
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
    if (validateLength500(event.target.value)) {
      newArray[parseInt(event.target.name)] = event.target.value;
      setScope(newArray);
      setError(prev => ({ ...prev, scope: newArray.some(na => na) ? noErr : err }));
    } else if (!newArray[parseInt(event.target.name)]) {
      setError(prev => ({ ...prev, tujuan: { error: true, text: "Tidak boleh lebih dari 500 karakter." } }));
    }
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
    if (validateLength500(event.target.value)) {
      newArray[parseInt(event.target.name)] = event.target.value;
      setTarget(newArray);
      setError(prev => ({ ...prev, target: newArray.some(na => na) ? noErr : err }));
    } else if (!newArray[parseInt(event.target.name)]) {
      setError(prev => ({ ...prev, tujuan: { error: true, text: "Tidak boleh lebih dari 500 karakter." } }));
    }
  };

  const deleteTarget = (index) => {
    let newArray = [...target];
    newArray.splice(index, 1);
    setTarget(newArray);
  };

  const validateAll = () => {
    setError({
      tanggalMulai: data.tanggalMulai ? noErr : err,
      tanggalSelesai: data.tanggalSelesai ? noErr : err,
      tujuan: tujuan.some(tu => tu) ? noErr : err,
      scope: scope.some(sc => sc) ? noErr : err,
      target: target.some(ta => ta) ? noErr : err
    });

    if (data.tanggalMulai && data.tanggalSelesai && tujuan.some(tu => tu) && scope.some(sc => sc) && target.some(ta => ta))
      return true;
    else
      return false;
  };

  const simpan = () => {
    if (validateAll()) {
      setLoadingButton(true);
      const formatTujuan = tujuan.filter(d => d).map((d, i) => ({ kodedetail: "TUJUAN", kodesort: (i + 1), keterangan: d }));
      const formatScope = scope.filter(d => d).map((d, i) => ({ kodedetail: "SCOPE", kodesort: (i + 1), keterangan: d }));
      const formatTarget = target.filter(d => d).map((d, i) => ({ kodedetail: "TARGET", kodesort: (i + 1), keterangan: d }));
      const listdetail = formatTujuan.concat(formatScope, formatTarget);
      const formatData = {
        idcharter: data.idcharter ? data.idcharter : null,
        idproj: proyek.IDPROYEK,
        tglmulai: moment(data.tanggalMulai).format("DD/MM/YYYY"),
        tglselesai: moment(data.tanggalSelesai).format("DD/MM/YYYY"),
        listdetail: listdetail
      };
      if (edit) {
        // console.log("update", formatData);
        updateCharter(formatData)
          .then((response) => {
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
      }
      else {
        // console.log("create", formatData);
        createCharter(formatData)
          .then((response) => {
            // await getCharterByIdProyek(response.data.IDPROJ).then((response) => {
            const tujuan = response.data.LISTDETAIL.filter(d => d.KODEDETAIL === "TUJUAN");
            const scope = response.data.LISTDETAIL.filter(d => d.KODEDETAIL === "SCOPE");
            const target = response.data.LISTDETAIL.filter(d => d.KODEDETAIL === "TARGET");
            delete response.data.LISTDETAIL;
            const newData = {
              ...response.data,
              TUJUAN: tujuan,
              SCOPE: scope,
              TARGET: target
            };
            setData(formatDataCharter(newData));
            // });
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
    }
    else {
      setAlertDialog({ openAlertDialog: true, messageAlertDialog: "Data tidak valid. Silahkan cek data yang anda input", severity: "warning" });
    }
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
      <Grid item>
        <Typography variant="h4" gutterBottom>
          {edit ? "Ubah Charter" : "Tambah Charter"}
        </Typography>
      </Grid>
      <Divider />
      <Grid item container direction="column" spacing={2}>
        <Grid item xs container direction="row" spacing={2} justify="space-between">
          <Grid item xs>
            <TextField id="nomor" label="Nomor Charter" fullWidth
              value={data ? data.nomor : ""}
              disabled
              className={classes.textFieldDisabled}
            />
          </Grid>
          <Grid item xs>
            <TextField id="namaProyek" label="Nama Proyek" fullWidth
              value={proyek ? proyek.NAMAPROYEK : ""}
              disabled
              className={classes.textFieldDisabled}
            />
          </Grid>
        </Grid>
        <Grid item xs container direction="row" spacing={2} justify="space-between" >
          <Grid item xs>
            <TextField id="nikBPO" label="NIK BPO" fullWidth
              value={proyek ? proyek.NIKREQ : ""}
              disabled
              className={classes.textFieldDisabled}
            />
          </Grid>
          <Grid item xs>
            <TextField id="nikPM" label="NIK PM" fullWidth
              value={proyek ? proyek.NIKPM : ""}
              disabled
              className={classes.textFieldDisabled}
            />
          </Grid>
        </Grid>
        <Grid item xs container direction="row" spacing={2} justify="space-between" >
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
              inputVariant="outlined"
              className={classes.textField}
              views={['year', 'month', 'date']}
            />
          </Grid>
          <Grid item xs >
            <KeyboardDatePicker
              fullWidth
              clearable
              id="tanggalSelesai"
              format="DD/MM/YYYY"
              label="Tanggal Selesai"
              value={data ? data.tanggalSelesai : null}
              minDate={(data && data.tanggalMulai) || moment("1900-01-01", "YYYY-MM-DD")}
              onChange={(value) => handleChangeDate(value, "tanggalSelesai")}
              required
              error={error.tanggalSelesai.error}
              helperText={error.tanggalSelesai.text}
              inputVariant="outlined"
              className={classes.textField}
              views={['year', 'month', 'date']}
              disabled={!(data && data.tanggalMulai)}
            />
          </Grid>
        </Grid>
        <Grid item xs container spacing={2} >
          <Grid item xs>
            <AddTextFiels required label="Tujuan" error={error.tujuan.error} helperText={error.tujuan.text}
              data={tujuan} onAdd={addTujuan} onChange={changeTujuan} onDelete={deleteTujuan} />
            <AddTextFiels required label="Ruang Lingkup" error={error.scope.error} helperText={error.scope.text}
              data={scope} onAdd={addScope} onChange={changeScope} onDelete={deleteScope} />
            <AddTextFiels required label="Target / Hasil Capaian" error={error.target.error} helperText={error.target.text}
              data={target} onAdd={addTarget} onChange={changeTarget} onDelete={deleteTarget} />
          </Grid>
        </Grid>
      </Grid>
      <Divider />
      <Grid item container justify="flex-end">
        <Button onClick={loadingButton ? null : simpan} color="primary" variant="contained" >
          {loadingButton ? <CircularProgress size={20} color="inherit" /> : edit ? "Ubah" : "Simpan"}
        </Button>
      </Grid>
    </Grid >
  );
};