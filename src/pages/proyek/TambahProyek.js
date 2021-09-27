import React, { useState, useEffect } from 'react';
import { Grid, makeStyles, Typography, TextField, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Paper, Button, Divider, FormHelperText, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { jenisLayanan, jenisAplikasi } from '../../utils/DataEnum';
import { getAplikasi, createAplikasi } from '../../gateways/api/AplikasiAPI';
import { getModulByAplikasiId, createModul } from '../../gateways/api/ModulAPI';
import { useHistory } from "react-router-dom";
import { getLayananUnused } from '../../gateways/api/LayananAPI';
import { createProyek, getProyekById, updateProyek } from '../../gateways/api/ProyekAPI';
import { AddCircleOutline } from '@material-ui/icons';
import AlertDialog from '../../components/AlertDialog';

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
  },
  paperStepper: {
    padding: theme.spacing(2),
    color: theme.palette.text.secondary,
    background: '#90caf9',
  },
  radio: {
    margin: "6px 0px 1px 15px",
  },
  field: {
    margin: "6px 0px 6px 0px",
  },
  field2: {
    margin: "6px 0px 6px 0px",
    width: "85%"
  },
  fieldDisabled: {
    margin: "6px 0px 6px 0px",
    "& .MuiInputBase-root.Mui-disabled": {
      color: "rgba(0, 0, 0, 1)" // (default alpha is 0.38)
    }
  },
}));

const defaultDataProyek = {
  idProyek: null,
  namaProyek: null,
  namaUri: null,
  deskripsi: null,
  jenisLayanan: null,
  jenisAplikasi: null,
  aplikasi: null,
  modul: null,
};

const defaultError = {
  layanan: { error: false, message: "" },
  namaProyek: { error: false, message: "" },
  namaUri: { error: false, message: "" },
  deskripsi: { error: false, message: "" },
  jenisLayanan: { error: false, message: "" },
  jenisAplikasi: { error: false, message: "" },
  aplikasi: { error: false, message: "" },
  modul: { error: false, message: "" },
};

const defaultAlert = { openAlertDialog: false, messageAlertDialog: "", severity: "info" };

export default function DetailProyek(props) {
  const { proyek } = props;
  const classes = useStyles();
  const history = useHistory();

  const [listLayanan, setListLayanan] = useState([]);
  const [dataLayanan, setDataLayanan] = useState(null);
  const [loadingButton, setLoadingButton] = useState({ submit: false, submitDialog: false });
  const [sap, setSap] = useState(false);
  const [dataProyek, setDataProyek] = useState(defaultDataProyek);
  const [listAplikasi, setListAplikasi] = useState([]);
  const [listModul, setListModul] = useState([]);
  const [edit, setEdit] = useState(false);
  const [error, setError] = useState(defaultError);
  const [openDialogAplikasi, setOpenDialogAplikasi] = useState(false);
  const [openDialogModul, setOpenDialogModul] = useState(false);
  const open = openDialogAplikasi || openDialogModul;
  const [dataDialogAplikasi, setDataDialogAplikasi] = useState({ kodeapl: "", namaapl: "", ketapl: "" });
  const [errorDialogAplikasi, setErrorDialogAplikasi] = useState({ kodeapl: { error: false, message: "" }, namaapl: { error: false, message: "" }, ketapl: { error: false, message: "" } });
  const [dataDialogModul, setDataDialogModul] = useState({ idapl: null, namamodul: "", ketmodul: "" });
  const [errorDialogModul, setErrorDialogModul] = useState({ namamodul: { error: false, message: "" }, ketmodul: { error: false, message: "" } });
  const [alertDialog, setAlertDialog] = useState(defaultAlert);

  const handleCloseAlertDialog = () => {
    setAlertDialog({ ...alertDialog, openAlertDialog: false });
  };

  useEffect(() => {
    if (proyek) {
      getProyekById(proyek.IDPROYEK)
        .then((response) => {
          setEdit(true);
          setDataProyek({
            idProyek: response.data.IDPROYEK,
            namaProyek: response.data.NAMAPROYEK,
            namaUri: response.data.NAMAURI,
            deskripsi: response.data.KETPROYEK,
            jenisLayanan: response.data.KODELAYANAN,
            jenisAplikasi: response.data.KODEAPLIKASI,
            aplikasi: response.data.APLIKASI,
            modul: response.data.MODUL,
          });
          setDataLayanan({
            idLayanan: response.data.LAYANAN.IDLAYANAN,
            nomorLayanan: response.data.LAYANAN.NOLAYANAN,
            nikPM: response.data.LAYANAN.NIKPM,
            nikBPO: response.data.LAYANAN.NIKREQ,
            jenisLayanan: response.data.LAYANAN.KODELAYANAN,
            namaAplikasi: response.data.LAYANAN.NAMAAPLIKASI,
            keteranganAplikasi: response.data.LAYANAN.KETAPLIKASI,
            namaModul: response.data.LAYANAN.NAMAMODUL,
            keteranganLayanan: response.data.LAYANAN.KETLAYANAN
          });
        })
        .catch((error) => {
          if (error.response)
            setAlertDialog({ openAlertDialog: true, messageAlertDialog: error.response.data.message, severity: "error" });
          else
            setAlertDialog({ openAlertDialog: true, messageAlertDialog: error.message, severity: "error" });
        });
    }
  }, [proyek]);

  useEffect(() => {
    if (listLayanan.length === 0)
      getLayananUnused(proyek ? proyek.IDPROYEK : null)
        .then((response) => {
          setListLayanan(response.data.map(d => ({
            idLayanan: d.IDLAYANAN,
            nomorLayanan: d.NOLAYANAN,
            nikPM: d.NIKPM,
            nikBPO: d.NIKREQ,
            jenisLayanan: d.KODELAYANAN,
            namaAplikasi: d.NAMAAPLIKASI,
            keteranganAplikasi: d.KETAPLIKASI,
            namaModul: d.NAMAMODUL,
            keteranganLayanan: d.KETLAYANAN
          })));
        })
        .catch((error) => {
          if (error.response)
            setAlertDialog({ openAlertDialog: true, messageAlertDialog: error.response.data.message, severity: "error" });
          else
            setAlertDialog({ openAlertDialog: true, messageAlertDialog: error.message, severity: "error" });
        });
  }, [listLayanan, proyek]);

  useEffect(() => {
    if (listAplikasi.length === 0)
      getAplikasi()
        .then((response) => {
          setListAplikasi(response.data);
        })
        .catch((error) => {
          if (error.response)
            setAlertDialog({ openAlertDialog: true, messageAlertDialog: error.response.data.message, severity: "error" });
          else
            setAlertDialog({ openAlertDialog: true, messageAlertDialog: error.message, severity: "error" });
        });
  }, [listAplikasi]);

  useEffect(() => {
    if (dataProyek.aplikasi)
      getModulByAplikasiId(dataProyek.aplikasi.IDAPLIKASI)
        .then((response) => {
          setListModul(response.data);
        })
        .catch((error) => {
          if (error.response)
            setAlertDialog({ openAlertDialog: true, messageAlertDialog: error.response.data.message, severity: "error" });
          else
            setAlertDialog({ openAlertDialog: true, messageAlertDialog: error.message, severity: "error" });
        });
  }, [dataProyek.aplikasi]);

  const validateInputNamaProyek = (value) => {
    if (value.length <= 100) return true;
    else return false;
  };

  const validateInputNamaUri = (value) => {
    const regex = new RegExp(/^[\w-_]*$/);
    if (regex.test(value) && !["proyek", "404", "401"].includes(value) && value.length <= 25) return true;
    else return false;
  };

  const validateInputDeskripsi = (value) => {
    if (value.length <= 255) return true;
    else return false;
  };

  const handleChangeTextField = (event) => {
    const id = event.target.id;
    const value = event.target.value;
    setError(prev => ({
      ...prev,
      [id]: value ? { error: false, message: "" } : { error: true, message: "Tidak Boleh Kosong" }
    }));
    if (
      id === "namaProyek" ?
        validateInputNamaProyek(value)
        : id === "namaUri" ?
          validateInputNamaUri(value)
          : id === "deskripsi" ?
            validateInputDeskripsi(value)
            : false
    )
      setDataProyek(prevDataProyek => ({ ...prevDataProyek, [id]: value }));
  };

  const handleChangeRadio = (event) => {
    if (event.target.name === "jenisAplikasi") {
      if (event.target.value === "SAP") {
        setDataProyek(prev => ({ ...prev, jenisLayanan: "PERUBAHAN", aplikasi: listAplikasi ? listAplikasi.find(d => d.KODEAPLIKASI === "SAP") : null, modul: null }));
        setSap(true);
        setDataDialogModul(prev => ({ ...prev, idapl: listAplikasi ? listAplikasi.find(d => d.KODEAPLIKASI === "SAP").IDAPLIKASI : null }));
      }
      else {
        setDataProyek(prev => ({ ...prev, jenisLayanan: null, aplikasi: null }));
        setSap(false);
        setDataDialogModul(prev => ({ ...prev, idapl: null }));
      }
    }
    setError(prev => ({
      ...prev,
      [event.target.name]: event.target.value ? { error: false, message: "" } : { error: true, message: "Tidak Boleh Kosong" }
    }));
    setDataProyek(prevDataProyek => ({ ...prevDataProyek, [event.target.name]: event.target.value }));
  };

  const handleChangeAplikasi = (jenis, value) => {
    setListModul([]);
    setDataDialogModul(prev => ({ ...prev, idapl: value ? value.IDAPLIKASI : null }));
    setDataProyek(prevDataProyek => ({ ...prevDataProyek, modul: null, [jenis]: value }));
    setError(prev => ({ ...prev, modul: { error: false, message: "" }, [jenis]: value ? { error: false, message: "" } : { error: true, message: "Tidak Boleh Kosong" } }));
  };

  const handleChangeModul = (jenis, value) => {
    setDataProyek(prevDataProyek => ({ ...prevDataProyek, [jenis]: value }));
    setError(prev => ({ ...prev, [jenis]: value ? { error: false, message: "" } : { error: true, message: "Tidak Boleh Kosong" } }));
  };

  const handleBackToProyek = () => {
    history.push("/");
  };

  const validateAll = () => {
    let valid = true;
    const def = { error: false, message: "" };
    const err = { error: true, message: "Tidak Boleh Kosong" };
    setError({
      layanan: !(dataLayanan && dataLayanan.idLayanan) ? err : def,
      namaProyek: !dataProyek.namaProyek ? err : def,
      namaUri: !dataProyek.namaUri ? err : def,
      jenisLayanan: !dataProyek.jenisLayanan ? err : def,
      jenisAplikasi: !dataProyek.jenisAplikasi ? err : def,
      aplikasi: !dataProyek.aplikasi ? err : def,
      modul: !dataProyek.modul ? err : def,
      deskripsi: !dataProyek.deskripsi ? err : def,
    });
    if (
      !(dataLayanan && dataLayanan.idLayanan) ||
      !dataProyek.namaProyek ||
      !dataProyek.namaUri ||
      !dataProyek.jenisLayanan ||
      !dataProyek.jenisAplikasi ||
      !dataProyek.aplikasi ||
      !dataProyek.modul ||
      !dataProyek.deskripsi
    )
      valid = false;

    return valid;
  };

  const formatDataCreate = () => {
    return {
      idproj: dataProyek.idProyek ? dataProyek.idProyek : null,
      idlayanan: dataLayanan.idLayanan,
      statusapl: dataProyek.jenisAplikasi,
      jenislayanan: dataProyek.jenisLayanan,
      namaproj: dataProyek.namaProyek,
      ketproj: dataProyek.deskripsi ? dataProyek.deskripsi : "",
      namauri: dataProyek.namaUri,
      nikreq: dataLayanan.nikBPO,
      nikpm: dataLayanan.nikPM,
      idaplikasi: dataProyek.aplikasi ? dataProyek.aplikasi.IDAPLIKASI : null,
      idmodul: dataProyek.modul ? dataProyek.modul.IDMODUL : null
    };
  };

  const simpan = () => {
    setLoadingButton(prev => ({ ...prev, submit: true }));
    if (validateAll()) {
      if (edit) {
        updateProyek(formatDataCreate())
          .then((response) => {
            setEdit(true);
            setAlertDialog({ openAlertDialog: true, messageAlertDialog: "Berhasil ubah", severity: "success" });
            setLoadingButton(prev => ({ ...prev, submit: false }));
          })
          .catch((error) => {
            setLoadingButton(prev => ({ ...prev, submit: false }));
            if (error.response)
              setAlertDialog({ openAlertDialog: true, messageAlertDialog: error.response.data.message, severity: "error" });
            else
              setAlertDialog({ openAlertDialog: true, messageAlertDialog: error.message, severity: "error" });
          });
      }
      else {
        createProyek(formatDataCreate())
          .then((response) => {
            setDataProyek(prev => ({ ...prev, idProyek: response.data.idproyek }));
            setEdit(true);
            setAlertDialog({ openAlertDialog: true, messageAlertDialog: "Berhasil simpan", severity: "success" });
            setLoadingButton(prev => ({ ...prev, submit: false }));
          })
          .catch((error) => {
            setLoadingButton(prev => ({ ...prev, submit: false }));
            if (error.response)
              setAlertDialog({ openAlertDialog: true, messageAlertDialog: error.response.data.message, severity: "error" });
            else
              setAlertDialog({ openAlertDialog: true, messageAlertDialog: error.message, severity: "error" });
          });
      }
    } else {
      setAlertDialog({ openAlertDialog: true, messageAlertDialog: "Data tidak valid. Silahkan cek data yang anda input", severity: "warning" });
      setLoadingButton(prev => ({ ...prev, submit: false }));
    }
  };

  const handleCloseDialog = () => {
    setOpenDialogAplikasi(false);
    setOpenDialogModul(false);
    setDataDialogAplikasi({ kodeapl: "", namaapl: "", ketapl: "" });
    setDataDialogModul(prev => ({ ...prev, namamodul: "", ketmodul: "" }));
    setErrorDialogAplikasi({ kodeapl: { error: false, message: "" }, namaapl: { error: false, message: "" }, ketapl: { error: false, message: "" } });
    setErrorDialogModul({ namamodul: { error: false, message: "" }, ketmodul: { error: false, message: "" } });
  };

  const validateDataDialog = () => {
    const def = { error: false, message: "" };
    const err = { error: true, message: "Tidak Boleh Kosong" };
    let valid = true;

    if (openDialogAplikasi) {
      setErrorDialogAplikasi({
        kodeapl: dataDialogAplikasi.kodeapl ? def : err,
        namaapl: dataDialogAplikasi.namaapl ? def : err,
        ketapl: dataDialogAplikasi.ketapl ? def : err
      });
      if (
        !dataDialogAplikasi.kodeapl ||
        !dataDialogAplikasi.namaapl ||
        !dataDialogAplikasi.ketapl
      )
        valid = false;

      return valid;
    }
    else if (openDialogModul) {
      setErrorDialogModul({
        namamodul: dataDialogModul.namamodul ? def : err,
        ketmodul: dataDialogModul.ketmodul ? def : err
      });
      if (
        !dataDialogModul.namamodul ||
        !dataDialogModul.ketmodul
      )
        valid = false;

      return valid;
    }
    else return false;
  };

  const saveDialog = () => {
    setLoadingButton(prev => ({ ...prev, submitDialog: true }));
    if (validateDataDialog()) {
      if (openDialogAplikasi) {
        createAplikasi(dataDialogAplikasi)
          .then((response) => {
            setListAplikasi([]);
            handleCloseDialog();
            setAlertDialog({ openAlertDialog: true, messageAlertDialog: "Berhasil simpan", severity: "success" });
            setLoadingButton(prev => ({ ...prev, submitDialog: false }));
          })
          .catch((error) => {
            setLoadingButton(prev => ({ ...prev, submitDialog: false }));
            if (error.response)
              setAlertDialog({ openAlertDialog: true, messageAlertDialog: error.response.data.message, severity: "error" });
            else
              setAlertDialog({ openAlertDialog: true, messageAlertDialog: error.message, severity: "error" });
          });
      }
      else if (openDialogModul) {
        createModul(dataDialogModul)
          .then((response) => {
            setDataProyek(prev => ({ ...prev, aplikasi: { ...prev.aplikasi } }));
            handleCloseDialog();
            setAlertDialog({ openAlertDialog: true, messageAlertDialog: "Berhasil simpan", severity: "success" });
            setLoadingButton(prev => ({ ...prev, submitDialog: false }));
          })
          .catch((error) => {
            setLoadingButton(prev => ({ ...prev, submitDialog: false }));
            if (error.response)
              setAlertDialog({ openAlertDialog: true, messageAlertDialog: error.response.data.message, severity: "error" });
            else
              setAlertDialog({ openAlertDialog: true, messageAlertDialog: error.message, severity: "error" });
          });
      }
    } else {
      setAlertDialog({ openAlertDialog: true, messageAlertDialog: "Data tidak valid. Silahkan cek data yang anda input", severity: "warning" });
      setLoadingButton(prev => ({ ...prev, submitDialog: false }));
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
        <Typography variant="h4" gutterBottom>{edit ? "Ubah Proyek" : "Tambah Proyek"}</Typography>
      </Grid>
      <Divider />
      {dataLayanan && <Grid item>
        <Paper className={classes.paper}>
          <Grid container direction="column" spacing={2} >
            <Grid item>
              <Typography variant="h6" gutterBottom>{"Data Layanan"}</Typography>
            </Grid>
            <Grid item container direction="row" spacing={2} justify="space-between">
              <Grid item xs={6} container direction="column" >
                <Autocomplete id="layanan"
                  options={listLayanan}
                  getOptionLabel={option => option.nomorLayanan}
                  onChange={(e, v) => {
                    setError((prev) => ({
                      ...prev,
                      layanan: v ? { error: false, message: "" } : { error: true, message: "Tidak Boleh Kosong" }
                    }));
                    setDataLayanan(v);
                  }}
                  value={dataLayanan}
                  getOptionSelected={
                    (option, value) => option.nomorLayanan === value.nomorLayanan
                  }
                  renderOption={(option) => (
                    <React.Fragment>
                      {option.nomorLayanan}
                    </React.Fragment>
                  )}
                  renderInput={params => (
                    <TextField
                      {...params}
                      label="Nomor Layanan"
                      fullWidth
                      variant="outlined"
                      className={classes.field}
                      required
                      error={error.layanan.error}
                      helperText={error.layanan.message}
                    />
                  )}
                />
                <Grid item container direction="row" spacing={2} justify="space-between">
                  <Grid item xs>
                    <TextField
                      label="NIK BPO"
                      variant="outlined"
                      className={classes.field}
                      fullWidth
                      disabled
                      value={dataLayanan ? dataLayanan.nikBPO : ""}
                    />
                  </Grid>
                  <Grid item xs>
                    <TextField
                      label="NIK PM"
                      variant="outlined"
                      className={classes.field}
                      fullWidth
                      disabled
                      value={dataLayanan ? dataLayanan.nikPM : ""}
                    />
                  </Grid>
                </Grid>
                <Grid item xs>
                  <FormControl component="fieldset" disabled className={classes.radio}>
                    <FormLabel component="legend">Jenis Layanan</FormLabel>
                    <RadioGroup row aria-label="jenisLayanan" name="jenisLayanan" value={dataLayanan ? dataLayanan.jenisLayanan : ""} >
                      {jenisLayanan.map(d => (<FormControlLabel key={d.value} value={d.value} control={<Radio />} label={d.label} />))}
                    </RadioGroup>
                  </FormControl>
                </Grid>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Nama Aplikasi"
                  variant="outlined"
                  className={classes.field}
                  fullWidth
                  disabled
                  value={dataLayanan ? dataLayanan.namaAplikasi ? dataLayanan.namaAplikasi : "-" : ""}
                />
                <TextField
                  label="Nama Modul"
                  variant="outlined"
                  className={classes.field}
                  fullWidth
                  disabled
                  value={dataLayanan ? dataLayanan.namaModul ? dataLayanan.namaModul : "-" : ""}
                />
                <TextField
                  label="Keterangan"
                  variant="outlined"
                  className={classes.field}
                  fullWidth
                  disabled
                  value={dataLayanan ? dataLayanan.keteranganLayanan ? dataLayanan.keteranganLayanan : "-" : ""}
                />
              </Grid>
            </Grid>
          </Grid>
        </Paper>
      </Grid>}

      <Grid item container direction="row" spacing={2} justify="space-between">
        <Grid item xs={6}>
          {!Boolean(dataLayanan) && <Autocomplete id="layanan"
            options={listLayanan}
            getOptionLabel={option => option.nomorLayanan}
            onChange={(e, v) => {
              setError((prev) => ({
                ...prev,
                layanan: v ? { error: false, message: "" } : { error: true, message: "Tidak Boleh Kosong" }
              }));
              setDataLayanan(v);
            }}
            value={dataLayanan}
            getOptionSelected={
              (option, value) => option.nomorLayanan === value.nomorLayanan
            }
            renderOption={(option) => (
              <React.Fragment>
                {option.nomorLayanan}
              </React.Fragment>
            )}
            renderInput={params => (
              <TextField
                {...params}
                label="Nomor Layanan"
                fullWidth
                variant="outlined"
                className={classes.field}
                required
                error={error.layanan.error}
                helperText={error.layanan.message}
              />
            )}
          />}
          <Grid item container direction="row" spacing={2} justify="space-between">
            <Grid item xs>
              <TextField
                id="namaProyek"
                label="Nama Proyek"
                multiline
                variant="outlined"
                className={classes.field}
                fullWidth
                onChange={handleChangeTextField}
                value={dataProyek && dataProyek.namaProyek ? dataProyek.namaProyek : ""}
                required
                error={error.namaProyek.error}
                helperText={error.namaProyek.message}
              />
            </Grid>
            <Grid item xs>
              <TextField
                id="namaUri"
                label="Nama URI"
                multiline
                variant="outlined"
                className={classes.field}
                fullWidth
                onChange={handleChangeTextField}
                value={dataProyek && dataProyek.namaUri ? dataProyek.namaUri : ""}
                required
                error={error.namaUri.error}
                helperText={error.namaUri.message}
              />
            </Grid>
          </Grid>
          <TextField
            id="deskripsi"
            label="Deskripsi Proyek"
            multiline
            variant="outlined"
            className={classes.field}
            fullWidth
            onChange={handleChangeTextField}
            value={dataProyek && dataProyek.deskripsi ? dataProyek.deskripsi : ""}
            required
            error={error.deskripsi.error}
            helperText={error.deskripsi.message}
          />
          <FormControl component="fieldset" className={classes.radio} fullWidth error={error.jenisAplikasi.error}>
            <FormLabel component="legend">Jenis Aplikasi</FormLabel>
            <RadioGroup row aria-label="jenisAplikasi" name="jenisAplikasi" value={dataProyek && dataProyek.jenisAplikasi ? dataProyek.jenisAplikasi : ""} onChange={handleChangeRadio} >
              {jenisAplikasi.map(d => (<FormControlLabel key={d.value} value={d.value} control={<Radio />} label={d.label} />))}
            </RadioGroup>
            {error.jenisAplikasi.error && <FormHelperText id="my-helper-text">{error.jenisAplikasi.message}</FormHelperText>}
          </FormControl>
        </Grid>
        <Grid item xs={6} >
          <FormControl component="fieldset" className={classes.radio} fullWidth error={error.jenisLayanan.error} disabled={sap}>
            <FormLabel component="legend">Jenis Layanan</FormLabel>
            <RadioGroup row aria-label="jenisLayanan" name="jenisLayanan" value={dataProyek && dataProyek.jenisLayanan ? dataProyek.jenisLayanan : ""} onChange={handleChangeRadio}>
              {jenisLayanan.map(d => (<FormControlLabel key={d.value} value={d.value} control={<Radio />} label={d.label} />))}
            </RadioGroup>
            <FormHelperText id="my-helper-text">{error.jenisLayanan.message}</FormHelperText>
          </FormControl>
          {dataProyek && dataProyek.jenisAplikasi && !sap &&
            <Grid container direction="row" justify="space-between" alignItems="center" spacing={1}>
              <Grid item xs>
                <Autocomplete id="aplikasi"
                  options={listAplikasi.filter(d => d.KODEAPLIKASI !== "SAP")}
                  getOptionLabel={option => option.NAMAAPLIKASI}
                  onChange={(e, v) => handleChangeAplikasi("aplikasi", v)}
                  value={dataProyek && dataProyek.aplikasi ? dataProyek.aplikasi : null}
                  getOptionSelected={
                    (option, value) => option.IDAPLIKASI === value.IDAPLIKASI
                  }
                  renderOption={(option) => (
                    <React.Fragment>
                      {option.NAMAAPLIKASI}
                    </React.Fragment>
                  )}
                  renderInput={params => (
                    <TextField
                      {...params}
                      label="Aplikasi"
                      fullWidth
                      variant="outlined"
                      className={classes.field}
                      required
                      error={error.aplikasi.error}
                      helperText={error.aplikasi.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={1}>
                <IconButton onClick={() => setOpenDialogAplikasi(true)}>
                  <AddCircleOutline />
                </IconButton>
              </Grid>
            </Grid>
          }
          {dataProyek && dataProyek.jenisAplikasi &&
            <Grid container direction="row" alignItems="center" spacing={1}>
              <Grid item xs>
                <Autocomplete id="modul"
                  options={listModul}
                  getOptionLabel={option => option.NAMAMODUL}
                  onChange={(e, v) => handleChangeModul("modul", v)}
                  value={dataProyek && dataProyek.modul ? dataProyek.modul : null}
                  getOptionSelected={
                    (option, value) => option.IDMODUL === value.IDMODUL
                  }
                  renderOption={(option) => (
                    <React.Fragment>
                      {option.NAMAMODUL}
                    </React.Fragment>
                  )}
                  renderInput={params => (
                    <TextField
                      {...params}
                      label="Modul"
                      fullWidth
                      variant="outlined"
                      className={classes.field}
                      required
                      error={error.modul.error}
                      helperText={error.modul.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={1}>
                {dataDialogModul.idapl && <IconButton onClick={() => setOpenDialogModul(true)} >
                  <AddCircleOutline />
                </IconButton>}
              </Grid>
            </Grid>
          }
        </Grid>
      </Grid>
      <Divider />
      <Grid item container direction="row" justify="flex-end">
        <Button variant="contained" color="primary" onClick={loadingButton.submit ? null : simpan} >{loadingButton.submit ? <CircularProgress color="inherit" size={20} /> : edit ? "Ubah" : "Simpan"}</Button>
        <Button variant="contained" color="inherit" onClick={handleBackToProyek} style={{ marginLeft: 10 }} >{"Kembali"}</Button>
      </Grid>
      <Dialog
        fullWidth
        maxWidth="md"
        open={open}
        onClose={handleCloseDialog}
        aria-labelledby="max-width-dialog-title"
      >
        <DialogTitle id="max-width-dialog-title">{openDialogAplikasi ? "Tambah Aplikasi" : openDialogModul ? "Tambah Modul" : ""}</DialogTitle>
        <DialogContent dividers>
          {openDialogAplikasi ?
            <>
              <Grid container direction="row" spacing={2} justify="space-between">
                <Grid item xs>
                  <TextField
                    id="kodeapl"
                    label="Kode Aplikasi"
                    variant="outlined"
                    className={classes.field}
                    fullWidth
                    onChange={event => {
                      setErrorDialogAplikasi(prev => ({ ...prev, [event.target.id]: event.target.value ? { error: false, message: "" } : { error: true, message: "Tidak Boleh Kosong" } }));
                      if (event.target.value.length <= 15)
                        setDataDialogAplikasi(prev => ({ ...prev, [event.target.id]: event.target.value }));
                    }}
                    value={dataDialogAplikasi.kodeapl}
                    required
                    error={errorDialogAplikasi.kodeapl.error}
                    helperText={errorDialogAplikasi.kodeapl.message}
                  />
                </Grid>
                <Grid item xs>
                  <TextField
                    id="namaapl"
                    label="Nama Aplikasi"
                    variant="outlined"
                    className={classes.field}
                    fullWidth
                    onChange={event => {
                      setErrorDialogAplikasi(prev => ({ ...prev, [event.target.id]: event.target.value ? { error: false, message: "" } : { error: true, message: "Tidak Boleh Kosong" } }));
                      if (event.target.value.length <= 255)
                        setDataDialogAplikasi(prev => ({ ...prev, [event.target.id]: event.target.value }));
                    }}
                    value={dataDialogAplikasi.namaapl}
                    required
                    error={errorDialogAplikasi.namaapl.error}
                    helperText={errorDialogAplikasi.namaapl.message}
                  />
                </Grid>
              </Grid>
              <TextField
                id="ketapl"
                label="Keterangan"
                variant="outlined"
                className={classes.field}
                multiline
                fullWidth
                onChange={event => {
                  setErrorDialogAplikasi(prev => ({ ...prev, [event.target.id]: event.target.value ? { error: false, message: "" } : { error: true, message: "Tidak Boleh Kosong" } }));
                  if (event.target.value.length <= 400)
                    setDataDialogAplikasi(prev => ({ ...prev, [event.target.id]: event.target.value }));
                }}
                value={dataDialogAplikasi.ketapl}
                required
                error={errorDialogAplikasi.ketapl.error}
                helperText={errorDialogAplikasi.ketapl.message}
              />
            </>
            : openDialogModul ?
              <Grid container direction="row" spacing={2} justify="space-between">
                <Grid item xs>
                  <TextField
                    id="namamodul"
                    label="Nama Modul"
                    variant="outlined"
                    className={classes.field}
                    fullWidth
                    onChange={event => {
                      setErrorDialogModul(prev => ({ ...prev, [event.target.id]: event.target.value ? { error: false, message: "" } : { error: true, message: "Tidak Boleh Kosong" } }));
                      if (event.target.value.length <= 255)
                        setDataDialogModul(prev => ({ ...prev, [event.target.id]: event.target.value }));
                    }}
                    value={dataDialogModul.namamodul}
                    required
                    error={errorDialogModul.namamodul.error}
                    helperText={errorDialogModul.namamodul.message}
                  />
                </Grid>
                <Grid item xs>
                  <TextField
                    id="ketmodul"
                    label="Keterangan"
                    variant="outlined"
                    className={classes.field}
                    fullWidth
                    onChange={event => {
                      setErrorDialogModul(prev => ({ ...prev, [event.target.id]: event.target.value ? { error: false, message: "" } : { error: true, message: "Tidak Boleh Kosong" } }));
                      if (event.target.value.length <= 400)
                        setDataDialogModul(prev => ({ ...prev, [event.target.id]: event.target.value }));
                    }}
                    value={dataDialogModul.ketmodul}
                    required
                    error={errorDialogModul.ketmodul.error}
                    helperText={errorDialogModul.ketmodul.message}
                  />
                </Grid>
              </Grid> : null
          }
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="primary" onClick={loadingButton.submitDialog ? null : saveDialog} >{loadingButton.submitDialog ? <CircularProgress color="inherit" size={20} /> : "Simpan"}</Button>
          <Button variant="contained" color="inherit" onClick={handleCloseDialog} >Batal</Button>
        </DialogActions>
      </Dialog>

    </Grid >
  );
}