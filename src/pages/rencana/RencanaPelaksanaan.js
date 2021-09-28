import React, { useState, useEffect, useCallback } from 'react';
import { Grid, Typography, Button, TextField, makeStyles, Paper, IconButton, Checkbox, Divider, CircularProgress } from '@material-ui/core';
import AlertDialog from '../../components/AlertDialog';
import { AddCircleOutline, RemoveCircleOutline, CheckBoxOutlineBlank, CheckBox } from '@material-ui/icons';
import { KeyboardDatePicker } from '@material-ui/pickers';
import { Autocomplete } from '@material-ui/lab';
// import { getAllKaryawan, getAllKegiatan } from '../../gateways/api/CommonAPI';
import moment from 'moment';
import { createRencanaPelaksanaan, updateRencanaPelaksanaan } from '../../gateways/api/PlanAPI';
import { groupBy } from '../../utils/Common';

// const dummyKegiatan = [
//   { id: 1, kegiatan: "Initiation", target: "Dokumen 1" },
//   { id: 2, kegiatan: "Development", target: "Dokumen 2" },
//   { id: 3, kegiatan: "Testing", target: "Dokumen 3" },
//   { id: 4, kegiatan: "Deploy", target: "Dokumen 4" },
// ];

// const dummyKaryawan = [
//   { nik: "160035", nama: "M. MUSTAKIM", kodeOrganisasi: "IT1300" },
//   { nik: "160257", nama: "ANITA IKA NURCAHYANI", kodeOrganisasi: "IT1300" },
//   { nik: "170084", nama: "AKBAR HILMAN", kodeOrganisasi: "IT1300" },
//   { nik: "160260", nama: "ERVIN ADHI CAHYA N", kodeOrganisasi: "IT3100" },
//   { nik: "180136", nama: "ANNISA DWIDYA R", kodeOrganisasi: "IT1100" },
//   { nik: "900147", nama: "RINI ASTUTI", kodeOrganisasi: "IT1000" },
// ];

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
  fieldTableDisabled: {
    "& .MuiInputBase-root.Mui-disabled": {
      color: "rgba(0, 0, 0, 1)" // (default alpha is 0.38)
    }
  },
}));

const defaultAlert = { openAlertDialog: false, messageAlertDialog: "", severity: "info" };

const defaultData = { kegiatan: null, pelaksana: [], tanggalMulai: null, tanggalSelesai: null, target: "", disabled: false };

const err = { error: true, text: "Tidak boleh kosong." };
const noErr = { error: false, text: "" };
const defaultError = { kegiatan: noErr, pelaksana: noErr, tanggalMulai: noErr, tanggalSelesai: noErr };

export default function RencanaPelaksanaan(props) {
  const { plan, proyek, kegiatan, karyawan, minDate } = props;
  const classes = useStyles();

  const [loadingButton, setLoadingButton] = useState(false);
  const [edit, setEdit] = useState(false);
  const [nomor, setNomor] = useState("");
  const [data, setData] = useState();
  const [error, setError] = useState();
  const [listKegiatan, setListKegiatan] = useState();
  const [listKaryawan, setListKaryawan] = useState();
  const [alertDialog, setAlertDialog] = useState(defaultAlert);

  const handleCloseAlertDialog = () => {
    setAlertDialog({ ...alertDialog, openAlertDialog: false });
  };

  const formatNewData = useCallback((listdetail) => {
    const grouped = groupBy(listdetail, x => x.IDKEGIATAN);
    const newData = [];
    grouped.forEach((value, key, map) => {
      const pelaksana = listKaryawan ? value.map(v => listKaryawan.filter(kar => kar.nik === v.NIKPELAKSANA)[0] || ({ nik: v.NIKPELAKSANA })) : [];
      const kegiatan = listKegiatan ? listKegiatan.filter(keg => keg.id === key)[0] : null;
      newData.push({
        kegiatan: kegiatan,
        pelaksana: pelaksana,
        tanggalMulai: moment(value[0].TGLMULAI, "DD/MM/YYYY"),
        tanggalSelesai: moment(value[0].TGLSELESAI, "DD/MM/YYYY"),
        target: kegiatan ? kegiatan.target : "",
        disabled: value[0].REALISASI
      });
    });
    if (listKaryawan && listKegiatan)
      newData.sort((a, b) => a.kegiatan.id - b.kegiatan.id);
    return newData;
  }, [listKaryawan, listKegiatan]);

  useEffect(() => {
    if (Object.keys(plan).length > 0) {
      const newData = formatNewData(plan.LISTDETAIL);
      setEdit(true);
      setNomor(plan.NOPLAN);
      setData(newData);
      setError(newData.map(d => defaultError));
    } else {
      setData([defaultData]);
      setError([defaultError]);
    }
  }, [plan, formatNewData]);

  useEffect(() => {
    if (!listKegiatan) {
      setListKegiatan(kegiatan);
    }
  }, [listKegiatan, kegiatan]);

  useEffect(() => {
    if (!listKaryawan) {
      setListKaryawan(karyawan);
    }
  }, [listKaryawan, karyawan]);

  const handleChange = (value, index, key) => {
    let newArrayError = [...error];
    if (key === "pelaksana")
      newArrayError[index] = { ...newArrayError[index], [key]: value.length > 0 ? noErr : err };
    else
      newArrayError[index] = { ...newArrayError[index], [key]: value ? noErr : err };
    setError(newArrayError);

    let newArray = [...data];
    if (key === "kegiatan") {
      newArray[index] = { ...newArray[index], [key]: value, target: value ? value.target : "" };
    } else if (key === "tanggalMulai") {
      newArray[index] = { ...newArray[index], [key]: value, tanggalSelesai: value < newArray[index].tanggalSelesai ? newArray[index].tanggalSelesai : null };
    } else {
      newArray[index] = { ...newArray[index], [key]: value };
    }
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

  const validateAll = () => {
    setError(prev =>
      prev.map((er, i) => {
        const newObj = {
          kegiatan: data[i].kegiatan ? noErr : err,
          pelaksana: data[i].pelaksana.length > 0 ? noErr : err,
          tanggalMulai: data[i].tanggalMulai ? noErr : err,
          tanggalSelesai: data[i].tanggalSelesai ? noErr : err
        };
        return newObj;
      })
    );
    if (data.every(dt => dt.kegiatan && dt.pelaksana.length > 0 && dt.tanggalMulai && dt.tanggalSelesai)) return true;
    else return false;
  };

  const simpan = () => {
    setLoadingButton(true);
    if (data.length > 0) {
      if (validateAll()) {
        const listdetail = data.map(dt => ({
          // idplan: dt.idplan ? dt.idplan : null,
          idkegiatan: dt.kegiatan.id,
          pelaksana: dt.pelaksana.map(pel => pel.nik),
          tglmulai: moment(dt.tanggalMulai).format("DD/MM/YYYY"),
          tglselesai: moment(dt.tanggalSelesai).format("DD/MM/YYYY")
        }));
        const formatData = {
          idproj: proyek.IDPROYEK,
          listdetail: listdetail
        };
        if (edit) {
          updateRencanaPelaksanaan(formatData)
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
          createRencanaPelaksanaan(formatData)
            .then((response) => {
              setData(formatNewData(response.data.LISTDETAIL));
              setNomor(response.data.NOPLAN);
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
          {edit ? "Ubah Rencana Pelaksanaan" : "Tambah Rencana Pelaksanaan"}
        </Typography>
      </Grid>
      <Divider />
      <Grid item xs={6}>
        <TextField id="nomor"
          label="Nomor Rencana Pelaksanaan"
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
                <Typography variant="h6">Data Rencana</Typography>
              </Grid>
            </Grid>
            <Grid item container direction="column" spacing={1}>
              <Grid item container direction="row" spacing={1} justify="space-between">
                <Grid item xs>
                  <Typography align="center" variant="body2"><b>Kegiatan</b></Typography>
                </Grid>
                <Grid item xs>
                  <Typography align="center" variant="body2"><b>Pelaksana</b></Typography>
                </Grid>
                <Grid item xs={2}>
                  <Typography align="center" variant="body2"><b>Tanggal Mulai</b></Typography>
                </Grid>
                <Grid item xs={2}>
                  <Typography align="center" variant="body2"><b>Tanggal Selesai</b></Typography>
                </Grid>
                <Grid item xs={2}>
                  <Typography align="center" variant="body2"><b>Target</b></Typography>
                </Grid>
                <Grid item xs={1}>
                  <Typography align="center" variant="body2"><b>Actions</b></Typography>
                </Grid>
              </Grid>
              {data && data.map((d, i) =>
                <Grid item key={"grid-cont-" + i} container direction="row" spacing={1} justify="space-between" alignItems="flex-start">
                  <Grid key={"grid-kegiatan-" + i} item xs>
                    <Autocomplete key={"kegiatan-" + i} id={"kegiatan-" + i} name={"kegiatan-" + i}
                      options={listKegiatan || []}
                      getOptionLabel={option => option.kegiatan}
                      onChange={(e, v) => handleChange(v, i, "kegiatan")}
                      value={d.kegiatan}
                      getOptionSelected={
                        (option, value) => option.id === value.id
                      }
                      renderOption={(option) => (
                        <React.Fragment>
                          {option.kegiatan}
                        </React.Fragment>
                      )}
                      renderInput={params => (
                        <TextField
                          {...params}
                          fullWidth
                          variant={d.disabled ? "standard" : "outlined"}
                          size="small"
                          error={error[i].kegiatan.error}
                          helperText={error[i].kegiatan.text}
                          className={d.disabled ? classes.fieldDisabled : null}
                        />
                      )}
                      disabled={d.disabled}
                    />
                  </Grid>
                  <Grid key={"grid-pelaksana-" + i} item xs>
                    <Autocomplete key={"pelaksana-" + i} id={"pelaksana-" + i} name={"pelaksana-" + i}
                      multiple
                      disableCloseOnSelect
                      options={listKaryawan || []}
                      value={d.pelaksana}
                      getOptionLabel={option => option.nik}
                      onChange={(e, v) => handleChange(v, i, "pelaksana")}
                      getOptionSelected={
                        (option, value) => option.nik === value.nik
                      }
                      renderOption={(option, { selected }) => (
                        <React.Fragment>
                          <Checkbox
                            icon={<CheckBoxOutlineBlank fontSize="small" />}
                            checkedIcon={<CheckBox fontSize="small" />}
                            style={{ marginRight: 6 }}
                            checked={selected}
                          />
                          {option.nik}, {option.nama}
                        </React.Fragment>
                      )}
                      renderInput={params => (
                        <TextField
                          {...params}
                          fullWidth
                          variant={d.disabled ? "standard" : "outlined"}
                          size="small"
                          error={error[i].pelaksana.error}
                          helperText={error[i].pelaksana.text}
                        />
                      )}
                      disabled={d.disabled}
                    />
                  </Grid>
                  <Grid key={"grid-mulai-" + i} item xs={2}>
                    <KeyboardDatePicker key={"mulai-" + i} id={"mulai-" + i} name={"mulai-" + i}
                      fullWidth
                      clearable
                      format="DD/MM/YYYY"
                      size="small"
                      value={d.tanggalMulai}
                      minDate={minDate ? moment(minDate, "DD/MM/YYYY") : moment("1900-01-01", "YYYY-MM-DD")}
                      onChange={(value) => handleChange(value, i, "tanggalMulai")}
                      error={error[i].tanggalMulai.error}
                      helperText={error[i].tanggalMulai.text}
                      inputVariant={d.disabled ? "standard" : "outlined"}
                      views={['year', 'month', 'date']}
                      disabled={d.disabled}
                      className={d.disabled ? classes.fieldDisabled : null}
                    />
                  </Grid>
                  <Grid key={"grid-selesai-" + i} item xs={2}>
                    <KeyboardDatePicker key={"selesai-" + i} id={"selesai-" + i} name={"selesai-" + i}
                      fullWidth
                      clearable
                      format="DD/MM/YYYY"
                      size="small"
                      value={d.tanggalSelesai}
                      minDate={d.tanggalMulai || moment("1900-01-01", "YYYY-MM-DD")}
                      onChange={(value) => handleChange(value, i, "tanggalSelesai")}
                      error={error[i].tanggalSelesai.error}
                      helperText={error[i].tanggalSelesai.text}
                      inputVariant={d.disabled ? "standard" : "outlined"}
                      views={['year', 'month', 'date']}
                      disabled={d.disabled || !d.tanggalMulai}
                      className={d.disabled ? classes.fieldDisabled : null}
                    />
                  </Grid>
                  <Grid key={"grid-target-" + i} item xs={2}>
                    <TextField key={"target-" + i} id={"target-" + i} name={"target-" + i}
                      multiline
                      fullWidth
                      size="small"
                      value={d.target}
                      disabled
                      className={classes.fieldTableDisabled}
                    />
                  </Grid>
                  <Grid item xs={1} container justify="center">
                    <IconButton size="small" onClick={() => deleteRow(i)} disabled={d.disabled}>
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