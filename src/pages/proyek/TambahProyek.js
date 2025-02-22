import React, { useState, useEffect,useContext } from 'react';
import { Grid, makeStyles, Typography, TextField, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Paper, Button, Divider, FormHelperText,  Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress, MenuItem } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { jenisLayanan, jenisAplikasi, statusProyek } from '../../utils/DataEnum';
import { getAplikasi, createAplikasi } from '../../gateways/api/AplikasiAPI';
import { getModulByAplikasiId, createModul } from '../../gateways/api/ModulAPI';
import { useHistory } from "react-router-dom";
import { getLayananUnused } from '../../gateways/api/LayananAPI';
import { createProyek, getProyekById, ubahStatusProyek, updateProyek } from '../../gateways/api/ProyekAPI';

import AlertDialog from '../../components/AlertDialog';
import { UserContext } from "../../utils/UserContext";



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
 // namaUri: null,
  deskripsi: null,
  jenisLayanan: null,
  jenisAplikasi: null,
  aplikasi: null,
  modul: null,
  //deskripsimpti:null,
  //deskripsiproker:null
};

const defaultError = {
  layanan: { error: false, message: "" },
  mpti: { error: false, message: "" },
  proker: { error: false, message: "" },
  namaProyek: { error: false, message: "" },
 // namaUri: { error: false, message: "" },
  deskripsi: { error: false, message: "" },
  jenisLayanan: { error: false, message: "" },
  jenisAplikasi: { error: false, message: "" },
  aplikasi: { error: false, message: "" },
  modul: { error: false, message: "" },
 
};

const defaultAlert = { openAlertDialog: false, messageAlertDialog: "", severity: "info" };

export default function TambahProyek(props) {
  const { proyek } = props;
  const classes = useStyles();
  const history = useHistory();
  const { mpti:listmpti,proker:cproker } =  useContext(UserContext);

  const isDisabled = proyek && proyek.STATUSPROYEK !== "BARU" ? true : false;
  const [listLayanan, setListLayanan] = useState([]);
  const [dataLayanan, setDataLayanan] = useState(null);
  const [loadingButton, setLoadingButton] = useState({ submit: false, submitDialog: false });
  const [sap, setSap] = useState(false);
  const [dataMpti, setDataMpti] = useState(null)
  const [listProker,setListProker]=useState(null)
  const [dataProker,setDataProker] = useState(null)
  const [dataProyek, setDataProyek] = useState(defaultDataProyek);
  const [listAplikasi, setListAplikasi] = useState([]);
  const [listModul, setListModul] = useState([]);
  const [edit, setEdit] = useState(false);
  const [error, setError] = useState(defaultError);
  const [openDialogAplikasi, setOpenDialogAplikasi] = useState(false);
  const [openDialogModul, setOpenDialogModul] = useState(false);
  const [dataDialogAplikasi, setDataDialogAplikasi] = useState({ kodeapl: "", namaapl: "", ketapl: "" });
  const [errorDialogAplikasi, setErrorDialogAplikasi] = useState({ kodeapl: { error: false, message: "" }, namaapl: { error: false, message: "" }, ketapl: { error: false, message: "" } });
  const [dataDialogModul, setDataDialogModul] = useState({ idapl: null, namamodul: "", ketmodul: "" });
  const [errorDialogModul, setErrorDialogModul] = useState({ namamodul: { error: false, message: "" }, ketmodul: { error: false, message: "" } });
  const [alertDialog, setAlertDialog] = useState(defaultAlert);
  const [openDialogStatus, setOpenDialogStatus] = useState(false);
  const [dataDialogStatus, setDataDialogStatus] = useState({ status: null, keterangan: null });
  const [errorDialogStatus, setErrorDialogStatus] = useState({ status: { error: false, message: "" }, keterangan: { error: false, message: "" } });
  const open = openDialogAplikasi || openDialogModul || openDialogStatus;

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
            //namaUri: response.data.NAMAURI,
            deskripsi: response.data.KETPROYEK,
            jenisLayanan: response.data.KODELAYANAN,
            jenisAplikasi: response.data.KODEAPLIKASI,
            aplikasi: response.data.APLIKASI,
            modul: response.data.MODUL,
           
            
          });
          setDataMpti(listmpti.find((d)=>d.id===Number(response.data.IDMPTI)))
          setListProker(cproker.filter((d)=>d.id===Number(response.data.IDMPTI)))
          setDataProker(cproker.find((d)=>d.id===Number(response.data.IDPROKER)))
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
  }, [proyek,cproker,listmpti]);

  useEffect(() => {
    if (listLayanan.length === 0)
      getLayananUnused(proyek ? proyek.IDPROYEK : null)
        .then((response) => {
          setListLayanan(response.data.sort((a, b) => b.IDLAYANAN - a.IDLAYANAN).map(d => ({
            idLayanan: d.IDLAYANAN,
            nomorLayanan: d.NOLAYANAN +" - "+d.NOTIKET,
            nikPM: d.NIKPM,
            nikBPO: d.NIKREQ,
            jenisLayanan: d.KODELAYANAN,
            namaAplikasi: d.NAMAAPLIKASI,
            keteranganAplikasi: d.KETAPLIKASI,
            namaModul: d.NAMAMODUL,
            keteranganLayanan: d.KETLAYANAN,
            prioritas : d.PRIORITAS
            
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

  // const validateInputNamaUri = (value) => {
  //   const regex = new RegExp(/^[\w-_]*$/);
  //   if (regex.test(value) && !["proyek", "404", "401"].includes(value) && value.length <= 25) return true;
  //   else return false;
  // };

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
        // : id === "namaUri" ?
        //   validateInputNamaUri(value)
          : id === "deskripsi" ?
            validateInputDeskripsi(value)
            : false
    )
      setDataProyek(prevDataProyek => ({ ...prevDataProyek, [id]: value }));
  };

  const handleChangeRadio = (event) => {
    if (event.target.name === "jenisAplikasi") {
      setListModul([]);
      if (event.target.value === "SAP") {
        
        setDataProyek(prev => ({ ...prev, jenisLayanan: "PERUBAHAN", aplikasi:  null, modul: null }));
        setSap(true);
        setDataDialogModul(prev => ({ ...prev, idapl:  null }));
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
      //namaUri: !dataProyek.namaUri ? err : def,
      jenisLayanan: !dataProyek.jenisLayanan ? err : def,
      jenisAplikasi: !dataProyek.jenisAplikasi ? err : def,
      aplikasi: !dataProyek.aplikasi ? err : def,
      modul: !dataProyek.modul ? err : def,
      deskripsi: !dataProyek.deskripsi ? err : def,
      mpti: !(dataMpti && dataMpti.id) ? err : def,
      proker: !(dataProker && dataProker.id) ? err : def,
    });
    if (
      !(dataLayanan && dataLayanan.idLayanan) ||
      !dataProyek.namaProyek ||
      //!dataProyek.namaUri ||
      !dataProyek.jenisLayanan ||
      !dataProyek.jenisAplikasi ||
      !dataProyek.aplikasi ||
      !dataProyek.modul ||
      !dataProyek.deskripsi||
      //||
      !(dataMpti && dataMpti.id)||
      !(dataProker && dataProker.id)
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
      idmpti:dataMpti.id,
      idproker:dataProker.id,
      
      //namauri: dataProyek.namaUri,
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
          .then(handleBackToProyek)
          .catch((error) => {
            setLoadingButton(prev => ({ ...prev, submit: false }));
            if (error.response)
              setAlertDialog({ openAlertDialog: true, messageAlertDialog: error.response.data.message, severity: "error" });
            else
              setAlertDialog({ openAlertDialog: true, messageAlertDialog: error.message, severity: "error" });
          });
      }
      else {
        console.log(formatDataCreate());
        createProyek(formatDataCreate())
          .then((response) => {
            setDataProyek(prev => ({ ...prev, idProyek: response.data.idproyek }));
            setEdit(true);
            setAlertDialog({ openAlertDialog: true, messageAlertDialog: "Berhasil simpan", severity: "success" });
            setLoadingButton(prev => ({ ...prev, submit: false }));
          })
          .then(handleBackToProyek)
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
    setOpenDialogStatus(false);
    setDataDialogAplikasi({ kodeapl: "", namaapl: "", ketapl: "" });
    setDataDialogModul(prev => ({ ...prev, namamodul: "", ketmodul: "" }));
    setDataDialogStatus({ status: null, keterangan: null });
    setErrorDialogAplikasi({ kodeapl: { error: false, message: "" }, namaapl: { error: false, message: "" }, ketapl: { error: false, message: "" } });
    setErrorDialogModul({ namamodul: { error: false, message: "" }, ketmodul: { error: false, message: "" } });
    setErrorDialogStatus({ status: { error: false, message: "" }, keterangan: { error: false, message: "" } });
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
    else if (openDialogStatus) {
      setErrorDialogStatus({
        status: dataDialogStatus.status ? def : err,
        keterangan: dataDialogStatus.status === "BERJALAN" ? def : dataDialogStatus.keterangan ? def : err 
      });
      if (
        !dataDialogStatus.status ||
        (dataDialogStatus.status !=="BERJALAN" && !dataDialogStatus.keterangan)
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
      else if (openDialogStatus) {
        // console.log(dataDialogStatus);

        const newData = {
          idproj: proyek.IDPROYEK,
          status: dataDialogStatus.status,
          ket: dataDialogStatus.keterangan
        };

        ubahStatusProyek(newData)
          .then((response) => {
            // setDataProyek(prev => ({ ...prev, aplikasi: { ...prev.aplikasi } }));
            handleCloseDialog();
            setAlertDialog({ openAlertDialog: true, messageAlertDialog: "Berhasil ubah status proyek", severity: "success" });
            setLoadingButton(prev => ({ ...prev, submitDialog: false }));
          })
          .catch((error) => {
            setLoadingButton(prev => ({ ...prev, submitDialog: false }));
            if (error.response)
              setAlertDialog({ openAlertDialog: true, messageAlertDialog: error.response.data.message, severity: "error" });
            else
              setAlertDialog({ openAlertDialog: true, messageAlertDialog: error.message, severity: "error" });
          });
        // setLoadingButton(prev => ({ ...prev, submitDialog: false }));
        // handleCloseDialog();
        // createModul(dataDialogModul)
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
                  disabled={edit}
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
                <Grid item container direction="row" spacing={2} justify="space-between">
                <Grid item xs>
                  <FormControl component="fieldset" disabled className={classes.radio}>
                    <FormLabel component="legend">Jenis Layanan</FormLabel>
                    <RadioGroup row aria-label="jenisLayanan" name="jenisLayanan" value={dataLayanan ? dataLayanan.jenisLayanan : ""} >
                      {jenisLayanan.map(d => (<FormControlLabel key={d.value} value={d.value} control={<Radio />} label={d.label} />))}
                    </RadioGroup>
                  </FormControl>
                  </Grid>
                  <Grid item xs>
                  <TextField
                      label="Prioritas"
                      variant="outlined"
                      className={classes.field}
                      fullWidth
                      disabled
                      value={dataLayanan ? dataLayanan.prioritas?  dataLayanan.prioritas:"": ""}
                    />
                </Grid>
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
                disabled={isDisabled}
              />
            </Grid>
            {/* <Grid item xs>
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
                disabled={isDisabled}
              />
            </Grid> */}
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
            disabled={isDisabled}
          />
          <Grid item container direction="row" spacing={2} justify="space-between">
          
      <Grid item xs>
      <Autocomplete id="mpti"
                  options={listmpti}
                  getOptionLabel={option =>  option.KODEMPTI +" / "+ option.KETMPTI}
                  onChange={(e, v) => {
                    setError((prev) => ({
                      ...prev,
                      mpti: v ? { error: false, message: "" } : { error: true, message: "Tidak Boleh Kosong" }
                    }));
                    setListProker(v?cproker.filter((x)=>x.IDMPTI === v.id):[])
                    setDataProker(null)
                    setDataMpti(v);
                  }}
                  value={dataMpti||null}
                  getOptionSelected={
                    (option, value) => option.KODEMPTI === value?.KODEMPTI
                  }
                  renderOption={(option) => (
                    <React.Fragment>
                      {option.KODEMPTI +" / "+ option.KETMPTI}
                    </React.Fragment>
                  )}
                  renderInput={params => (
                    <TextField
                      {...params}
                      label="MPTI"
                      fullWidth
                      variant="outlined"
                      className={classes.field}
                      //required={mpti}
                     error={error.mpti.error}
                      helperText={error.mpti.message}
                    />
                  )}
                  //disabled={!mpti}
                />
          </Grid>
          
      </Grid>
      <Grid item container direction="row" spacing={2} justify="space-between">
      <Grid item xs>
      <Autocomplete id="proker"
                  options={listProker}
                  getOptionLabel={option =>  option.KODEPROKER +" / "+ option.KETPROKER}
                  onChange={(e, v) => {
                    setError((prev) => ({
                      ...prev,
                      proker: v ? { error: false, message: "" } : { error: true, message: "Tidak Boleh Kosong" }
                    }));
                    setDataProker(v);
                  }}
                  value={dataProker||null}
                  getOptionSelected={
                    (option, value) => option.KODEPROKER === value?.KODEPROKER
                  }
                  renderOption={(option) => (
                    <React.Fragment>
                      {option.KODEPROKER +" / "+ option.KETPROKER}
                    </React.Fragment>
                  )}
                  renderInput={params => (
                    <TextField
                      {...params}
                      label="Proker"
                      fullWidth
                      variant="outlined"
                      className={classes.field}
                      //required={proker}
                      error={ error.proker.error}
                      helperText={error.proker.message}
                    />
                  )}
                  disabled={!dataMpti}
                />
          </Grid>
          
          </Grid>
           
          <FormControl disabled={isDisabled} component="fieldset" className={classes.radio} fullWidth error={error.jenisAplikasi.error}>
            <FormLabel component="legend">Jenis Aplikasi</FormLabel>
            <RadioGroup row aria-label="jenisAplikasi" name="jenisAplikasi" value={dataProyek && dataProyek.jenisAplikasi ? dataProyek.jenisAplikasi : ""} onChange={handleChangeRadio} >
              {jenisAplikasi.map(d => (<FormControlLabel key={d.value} value={d.value} control={<Radio />} label={d.label} />))}
            </RadioGroup>
            {error.jenisAplikasi.error && <FormHelperText id="my-helper-text">{error.jenisAplikasi.message}</FormHelperText>}
          </FormControl>
        </Grid>
        <Grid item xs={6} >
          <FormControl component="fieldset" className={classes.radio} fullWidth error={error.jenisLayanan.error} disabled={sap || isDisabled}>
            <FormLabel component="legend">Jenis Layanan</FormLabel>
            <RadioGroup row aria-label="jenisLayanan" name="jenisLayanan" value={dataProyek && dataProyek.jenisLayanan ? dataProyek.jenisLayanan : ""} onChange={handleChangeRadio}>
              {jenisLayanan.map(d => (<FormControlLabel key={d.value} value={d.value} control={<Radio />} label={d.label} />))}
            </RadioGroup>
            <FormHelperText id="my-helper-text">{error.jenisLayanan.message}</FormHelperText>
          </FormControl>
          {dataProyek && dataProyek.jenisAplikasi && 
            <Grid container direction="row" justify="space-between" alignItems="center" spacing={1}>
              <Grid item xs>
                <Autocomplete id="aplikasi"
                  options={listAplikasi.filter(d => dataProyek.jenisAplikasi === "SAP"?d.KODEAPLIKASI.substr(0,2) === "ER":d.KODEAPLIKASI.substr(0,2) === "BS")}
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
                  disabled={isDisabled}
                />
              </Grid>
              {/* <Grid item xs={1}>
                <IconButton onClick={() => setOpenDialogAplikasi(true)} disabled={isDisabled}>
                  <AddCircleOutline />
                </IconButton>
              </Grid> */}
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
                  disabled={isDisabled}
                />
              </Grid>
              {/* <Grid item xs={1}>
                {dataDialogModul.idapl && <IconButton onClick={() => setOpenDialogModul(true)} disabled={isDisabled}>
                  <AddCircleOutline />
                </IconButton>}
              </Grid> */}
            </Grid>
          }
        </Grid>
      </Grid>
      <Divider />
      <Grid item xs container direction="row" justify='space-between'>
        {proyek && <Grid item xs>
          <Button variant="contained" onClick={() => setOpenDialogStatus(true)} color="secondary" >{"Ubah Status"}</Button>
        </Grid>}
        <Grid item xs container justify="flex-end">
          <Button variant="contained" color="primary" onClick={loadingButton.submit ? null : simpan} disabled={isDisabled}>{loadingButton.submit ? <CircularProgress color="inherit" size={20} /> : edit ? "Ubah" : "Simpan"}</Button>
          <Button variant="contained" color="inherit" onClick={handleBackToProyek} style={{ marginLeft: 10 }} >{"Kembali"}</Button>
        </Grid>
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
              </Grid>
              : openDialogStatus ?
                <Grid container direction="row" spacing={2} justify="space-between">
                  <Grid item xs>
                    {/* <TextField
                      id="status"
                      label="Status"
                      variant="outlined"
                      className={classes.field}
                      fullWidth
                      onChange={event => {
                        setErrorDialogStatus(prev => ({ ...prev, [event.target.id]: event.target.value ? { error: false, message: "" } : { error: true, message: "Tidak Boleh Kosong" } }));
                        if (event.target.value.length <= 255)
                          setDataDialogStatus(prev => ({ ...prev, [event.target.id]: event.target.value }));
                      }}
                      value={dataDialogStatus.status || ""}
                      required
                      error={errorDialogStatus.status.error}
                      helperText={errorDialogStatus.status.message}
                    /> */}
                    <TextField
                      id="status"
                      label="Status"
                      variant="outlined"
                      className={classes.field}
                      select
                      fullWidth
                      value={dataDialogStatus.status || ""}
                      onChange={event => {
                        setErrorDialogStatus(prev => ({ ...prev, status: event.target.value ? { error: false, message: "" } : { error: true, message: "Tidak Boleh Kosong" } }));
                        if (event.target.value.length <= 255)
                          setDataDialogStatus(prev => ({ ...prev, status: event.target.value }));
                      }}
                      required
                      error={errorDialogStatus.status.error}
                      helperText={errorDialogStatus.status.message}
                    >
                      <MenuItem value="">
                        <em>Pilih</em>
                      </MenuItem>
                      {statusProyek.filter(x => x !== "BARU" && x!=="ALL" && x!=="DELAYED" && x !== proyek.STATUSPROYEK).map((d) => (
                        <MenuItem key={"menu-likely-faktor-" + d} value={d}>
                          {d}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs>
                    <TextField
                      multiline
                      id="ketstatus"
                      label="Keterangan"
                      variant="outlined"
                      className={classes.field}
                      fullWidth
                      onChange={event => {
                        setErrorDialogStatus(prev => ({ ...prev, keterangan: event.target.value ? { error: false, message: "" } : { error: true, message: "Tidak Boleh Kosong" } }));
                        if (event.target.value.length <= 400)
                          setDataDialogStatus(prev => ({ ...prev, keterangan: event.target.value }));
                      }}
                      value={dataDialogStatus.keterangan || ""}
                      required={dataDialogStatus.status !== "BERJALAN"?true:false}
                      disabled={dataDialogStatus.status === "BERJALAN"?true:false}
                      error={errorDialogStatus.keterangan.error}
                      helperText={errorDialogStatus.keterangan.message}
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