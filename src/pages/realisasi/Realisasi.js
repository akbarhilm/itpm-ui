import React, { useState, useEffect, useCallback } from 'react';
import { Grid, Typography, Button, TextField, makeStyles, Paper, Checkbox, Divider, CircularProgress } from '@material-ui/core';
import AlertDialog from '../../components/AlertDialog';
import { CheckBoxOutlineBlank, CheckBox } from '@material-ui/icons';
import { KeyboardDatePicker } from '@material-ui/pickers';
import { Autocomplete } from '@material-ui/lab';
import { groupBy } from '../../utils/Common';
import moment from 'moment';
import { createRealisasi, updateRealisasi } from '../../gateways/api/RealisasiAPI';

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

const defaultData = { kegiatan: null, pelaksana: [], tanggalMulai: null, tanggalSelesai: null, target: "" };

const err = { error: true, text: "Tidak boleh kosong." };
const noErr = { error: false, text: "" };
const defaultError = { kegiatan: noErr, pelaksana: noErr, tanggalMulai: noErr, tanggalSelesai: noErr };

export default function Realisasi(props) {
  const { realisasi, proyek, karyawan, kegiatan, plan } = props;
  const classes = useStyles();

  const [loadingButton, setLoadingButton] = useState(false);
  const [edit, setEdit] = useState(false);
  const [nomor, setNomor] = useState("");
  const [data, setData] = useState();
  const [error, setError] = useState();
  const [dataSave, setDataSave] = useState([]);
  const [minimumDate, setMinimumDate] = useState([]);
  const [listKaryawan, setListKaryawan] = useState();
  const [alertDialog, setAlertDialog] = useState(defaultAlert);

  const handleCloseAlertDialog = () => {
    setAlertDialog({ ...alertDialog, openAlertDialog: false });
  };

  const formatNewData = useCallback((listdetail) => {
    // menggabungkan data rencana dan realisasi menjadi 1 object
    if (Object.keys(plan).length > 0) {
      const groupedRencana = groupBy(plan.LISTDETAIL, x => x.IDKEGIATAN);
      const newlist = [];
      groupedRencana.forEach((value, key, map) => {
        newlist.push({
          idkegiatan: key,
          kegiatan: kegiatan.length > 0 ? kegiatan.filter(k => k.IDKEGIATAN === key)[0].NAMAKEGIATAN : "",
          pelaksana: listdetail.filter(l => l.IDKEGIATAN === key).length > 0 ?
            listdetail.filter(l => l.IDKEGIATAN === key)
              .map(r => karyawan.filter(kar => kar.nik === r.NIKPELAKSANA)[0] || ({ nik: r.NIKPELAKSANA }))
            : value.map(v => karyawan.filter(kar => kar.nik === v.NIKPELAKSANA)[0] || ({ nik: v.NIKPELAKSANA })),
          tanggalMulai: listdetail.filter(l => l.IDKEGIATAN === key).length > 0 ? moment(listdetail.filter(l => l.IDKEGIATAN === key)[0].TGLMULAI, "DD/MM/YYYY") : moment(value[0].TGLMULAI, "DD/MM/YYYY"),
          tanggalSelesai: listdetail.filter(l => l.IDKEGIATAN === key).length > 0 ? moment(listdetail.filter(l => l.IDKEGIATAN === key)[0].TGLSELESAI, "DD/MM/YYYY") : moment(value[0].TGLSELESAI, "DD/MM/YYYY"),
          disabled: listdetail.filter(l => l.IDKEGIATAN === key).length > 0 ? true : false,
          checked: listdetail.filter(l => l.IDKEGIATAN === key).length > 0 ? true : false,
        });
      });
      newlist.sort((a, b) => a.idkegiatan - b.idkegiatan); // sorting by idkegiatan asc
      return newlist;
    } else {
      return [];
    }
  }, [plan, karyawan, kegiatan]);

  useEffect(() => {
    if (Object.keys(plan).length > 0) {
      if (Object.keys(realisasi).length > 0 && realisasi.NOREAL) {
        setEdit(true);
        setNomor(realisasi.NOREAL);
      }
      const newData = formatNewData(realisasi.LISTDETAIL || []);

      // set minimum date dari data plan, bukan dari data hasil gabungan plan dan realisasi
      setMinimumDate(newData.map(x => moment(plan.LISTDETAIL.filter(p => x.idkegiatan === p.IDKEGIATAN)[0].TGLMULAI, "DD/MM/YYYY")));

      // set data realisasi yang sudah diinput sebagai data yang akan diubah
      setDataSave(newData.filter(x => x.disabled));

      // set data awal, gabungan dari plan dan real
      setData(newData);
      setError(newData.map(x => defaultError));
    } else {
      setData([defaultData]);
      setError([defaultError]);
    }
  }, [realisasi, plan, formatNewData]);

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

    if (newArray[index].checked) {
      setDataSave(prev => {
        let newData = [...prev];
        newData[newData.findIndex(x => x.idkegiatan === newArray[index].idkegiatan)] = newArray[index];
        return newData;
      });
    }
  };

  const onCheck = (value, index, dt) => {
    let newArray = [...data];
    newArray[index] = { ...newArray[index], checked: value };
    setData(newArray);

    let newDS = [...dataSave];
    if (value) {
      newDS.push(dt);
      setDataSave(newDS);
    } else {
      newDS.splice(newDS.findIndex(x => x.idkegiatan === dt.idkegiatan), 1);
      setDataSave(newDS);
    }
  };

  const validateAll = () => {
    setError(prev =>
      prev.map((er, i) => {
        if (data[i].checked) {
          const newObj = {
            kegiatan: data[i].kegiatan ? noErr : err,
            pelaksana: data[i].pelaksana.length > 0 ? noErr : err,
            tanggalMulai: data[i].tanggalMulai ? noErr : err,
            tanggalSelesai: data[i].tanggalSelesai ? noErr : err
          };
          return newObj;
        } else {
          return er;
        }
      })
    );
    // validasi data yang akan disimpan saja (yang sudah di check pada kolom pilih), bukan seluruh data yang terlihat pada page
    if (dataSave.every(dt => dt.kegiatan && dt.pelaksana.length > 0 && dt.tanggalMulai && dt.tanggalSelesai)) return true;
    else return false;
  };

  const simpan = () => {
    setLoadingButton(true);
    if (dataSave.length > 0) {
      if (validateAll()) {
        const listdetail = dataSave.map(dt => ({
          idkegiatan: dt.idkegiatan,
          pelaksana: dt.pelaksana.map(pel => pel.nik),
          tglmulai: moment(dt.tanggalMulai).format("DD/MM/YYYY"),
          tglselesai: moment(dt.tanggalSelesai).format("DD/MM/YYYY")
        }));
        const formatData = {
          idproj: proyek.IDPROYEK,
          listdetail: listdetail
        };
        if (edit) {
          updateRealisasi(formatData)
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
          createRealisasi(formatData)
            .then((response) => {
              setData(formatNewData(response.data.LISTDETAIL));
              setNomor(response.data.NOREAL);
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
          {edit ? "Ubah Realisasi" : "Tambah Realisasi"}
        </Typography>
      </Grid>
      <Divider />
      <Grid item xs={6}>
        <TextField id="nomor"
          label="Nomor Realisasi"
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
                <Typography variant="h6">Data Realisasi</Typography>
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
                <Grid item xs={1}>
                  <Typography align="center" variant="body2"><b>Pilih</b></Typography>
                </Grid>
              </Grid>
              {data && data.map((d, i) =>
                <Grid item key={"grid-cont-" + i} container direction="row" spacing={1} justify="space-between" alignItems="flex-start">
                  <Grid key={"grid-kegiatan-" + i} item xs>
                    <TextField key={"kegiatan-" + i} id={"kegiatan-" + i} name={"kegiatan-" + i}
                      fullWidth
                      size="small"
                      multiline
                      value={d.kegiatan ? d.kegiatan : ""}
                      disabled
                      className={classes.fieldTableDisabled}
                    />
                  </Grid>
                  <Grid key={"grid-pelaksana-" + i} item xs>
                    <Autocomplete key={"pelaksana-" + i} id={"pelaksana-" + i} name={"pelaksana-" + i}
                      multiple
                      disableCloseOnSelect
                      options={listKaryawan}
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
                          variant="outlined"
                          size="small"
                          error={error[i].pelaksana.error}
                          helperText={error[i].pelaksana.text}
                        />
                      )}
                    />
                  </Grid>
                  <Grid key={"grid-mulai-" + i} item xs={2}>
                    <KeyboardDatePicker key={"mulai-" + i} id={"mulai-" + i} name={"mulai-" + i}
                      fullWidth
                      clearable
                      format="DD/MM/YYYY"
                      size="small"
                      value={d.tanggalMulai}
                      minDate={minimumDate[i] || moment("1900-01-01", "YYYY-MM-DD")}
                      onChange={(value) => handleChange(value, i, "tanggalMulai")}
                      error={error[i].tanggalMulai.error}
                      helperText={error[i].tanggalMulai.text}
                      inputVariant={"outlined"}
                      views={['year', 'month', 'date']}
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
                      inputVariant={"outlined"}
                      views={['year', 'month', 'date']}
                      disabled={!d.tanggalMulai}
                      className={!d.tanggalMulai ? classes.fieldDisabled : null}
                    />
                  </Grid>
                  <Grid key={"grid-check-" + i} item xs={1} container justify="center">
                    <Checkbox key={"check-" + i} disabled={d.disabled} checked={d.checked} onChange={(e) => onCheck(e.target.checked, i, d)} />
                  </Grid>
                </Grid>
              )}
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