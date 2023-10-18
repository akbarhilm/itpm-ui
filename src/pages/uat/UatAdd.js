import React, { useState, useEffect, useCallback, useContext } from 'react';
import { Grid, Typography, Button, TextField, makeStyles, Divider, CircularProgress, Paper, IconButton } from '@material-ui/core';
import AlertDialog from '../../components/AlertDialog';
import { Autocomplete } from '@material-ui/lab';
import { RemoveCircleOutline, AddCircleOutline } from '@material-ui/icons';
import { createUat, updateUat } from '../../gateways/api/UatAPI';
import { UserContext } from '../../utils/UserContext';

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

const defaultData = { karyawan: null, nama: "", org: "" };

const err = { error: true, text: "Tidak boleh kosong." };
const noErr = { error: false, text: "" };
const defaultError = noErr;

export default function UatAdd(props) {
  const { uat, proyek, onClose, refresh } = props;
  const { karyawan } = useContext(UserContext);
  const classes = useStyles();

  const [loadingButton, setLoadingButton] = useState(false);
  const [edit, setEdit] = useState(false);
  const [nomor, setNomor] = useState("");
  const [dataAnalyst, setDataAnalyst] = useState();
  const [dataUser, setDataUser] = useState();
  const [dataQA, setDataQA] = useState();
  const [errorAnalyst, setErrorAnalyst] = useState();
  const [errorUser, setErrorUser] = useState();
  const [errorQA, setErrorQA] = useState();
  const [listKaryawan, setListKaryawan] = useState();
  const [alertDialog, setAlertDialog] = useState(defaultAlert);

  const handleCloseAlertDialog = () => {
    setAlertDialog({ ...alertDialog, openAlertDialog: false });
  };

  const formatNewData = useCallback((listdetail) => {
    const newData = {
      analyst: listdetail.filter(d => d.KODEUAT === "1")
        .map(x => ({
          karyawan: karyawan.filter(z => z.nik === x.NIKUAT).length > 0
            ? karyawan.filter(z => z.nik === x.NIKUAT)[0] : { nik: x.NIKUAT },
          nama: karyawan.filter(z => z.nik === x.NIKUAT).length > 0
            ? karyawan.filter(z => z.nik === x.NIKUAT)[0].nama : "",
          org: karyawan.filter(z => z.nik === x.NIKUAT).length > 0
            ? karyawan.filter(z => z.nik === x.NIKUAT)[0].organisasi + " / " + karyawan.filter(z => z.nik === x.NIKUAT)[0].nama_organisasi : ""
        })),
      user: listdetail.filter(d => d.KODEUAT === "2")
        .map(x => ({
          karyawan: karyawan.filter(z => z.nik === x.NIKUAT).length > 0
            ? karyawan.filter(z => z.nik === x.NIKUAT)[0] : { nik: x.NIKUAT },
          nama: karyawan.filter(z => z.nik === x.NIKUAT).length > 0
            ? karyawan.filter(z => z.nik === x.NIKUAT)[0].nama : "",
          org: karyawan.filter(z => z.nik === x.NIKUAT).length > 0
            ? karyawan.filter(z => z.nik === x.NIKUAT)[0].organisasi + " / " + karyawan.filter(z => z.nik === x.NIKUAT)[0].nama_organisasi : ""
        })),
      qa: listdetail.filter(d => d.KODEUAT === "3")
        .map(x => ({
          karyawan: karyawan.filter(z => z.nik === x.NIKUAT).length > 0
            ? karyawan.filter(z => z.nik === x.NIKUAT)[0] : { nik: x.NIKUAT },
          nama: karyawan.filter(z => z.nik === x.NIKUAT).length > 0
            ? karyawan.filter(z => z.nik === x.NIKUAT)[0].nama : "",
          org: karyawan.filter(z => z.nik === x.NIKUAT).length > 0
            ? karyawan.filter(z => z.nik === x.NIKUAT)[0].organisasi + " / " + karyawan.filter(z => z.nik === x.NIKUAT)[0].nama_organisasi : ""
        }))
    };

    return newData;
  }, [karyawan]);

  useEffect(() => {
    if (Object.keys(uat).length > 0) {
      setEdit(true);
      setNomor(uat.NOUAT);
      const data = formatNewData(uat.LISTDETAIL);
      setDataAnalyst(data.analyst);
      setDataUser(data.user);
      setDataQA(data.qa);
      setErrorAnalyst(data.analyst.map(x => defaultError));
      setErrorUser(data.user.map(x => defaultError));
      setErrorQA(data.qa.map(x => defaultError));
    } else {
      setDataAnalyst([defaultData]);
      setDataUser([defaultData]);
      setDataQA([defaultData]);
      setErrorAnalyst([defaultError]);
      setErrorUser([defaultError]);
      setErrorQA([defaultError]);
    }
  }, [uat, formatNewData]);

  useEffect(() => {
    if (!listKaryawan) {
      setListKaryawan(karyawan);
    }
  }, [listKaryawan, karyawan]);

  const handleChangeAnalyst = (value, index) => {
    let newArrayError = [...errorAnalyst];
    newArrayError[index] = value ? noErr : err;
    setErrorAnalyst(newArrayError);

    let newArray = [...dataAnalyst];
    newArray[index] = { karyawan: value, nama: value ? value.nama : "", org: value ? value.organisasi + " / " + value.nama_organisasi : "" };
    setDataAnalyst(newArray);
  };

  const addRowAnalyst = () => {
    let newArrayError = [...errorAnalyst];
    newArrayError.push(defaultError);
    setErrorAnalyst(newArrayError);

    let newArray = [...dataAnalyst];
    newArray.push(defaultData);
    setDataAnalyst(newArray);
  };

  const deleteRowAnalyst = (index) => {
    let newArrayError = [...errorAnalyst];
    newArrayError.splice(index, 1);
    setErrorAnalyst(newArrayError);

    let newArray = [...dataAnalyst];
    newArray.splice(index, 1);
    setDataAnalyst(newArray);
  };

  const handleChangeUser = (value, index) => {
    let newArrayError = [...errorUser];
    newArrayError[index] = value ? noErr : err;
    setErrorUser(newArrayError);

    let newArray = [...dataUser];
    newArray[index] = { karyawan: value, nama: value ? value.nama : "", org: value ? value.organisasi + " / " + value.nama_organisasi : "" };
    setDataUser(newArray);
  };

  const addRowUser = () => {
    let newArrayError = [...errorUser];
    newArrayError.push(defaultError);
    setErrorUser(newArrayError);

    let newArray = [...dataUser];
    newArray.push(defaultData);
    setDataUser(newArray);
  };

  const deleteRowUser = (index) => {
    let newArrayError = [...errorUser];
    newArrayError.splice(index, 1);
    setErrorUser(newArrayError);

    let newArray = [...dataUser];
    newArray.splice(index, 1);
    setDataUser(newArray);
  };

  const handleChangeQA = (value, index) => {
    let newArrayError = [...errorQA];
    newArrayError[index] = value ? noErr : err;
    setErrorQA(newArrayError);

    let newArray = [...dataQA];
    newArray[index] = { karyawan: value, nama: value ? value.nama : "", org: value ? value.organisasi + " / " + value.nama_organisasi : "" };
    setDataQA(newArray);
  };

  const addRowQA = () => {
    let newArrayError = [...errorQA];
    newArrayError.push(defaultError);
    setErrorQA(newArrayError);

    let newArray = [...dataQA];
    newArray.push(defaultData);
    setDataQA(newArray);
  };

  const deleteRowQA = (index) => {
    let newArrayError = [...errorQA];
    newArrayError.splice(index, 1);
    setErrorQA(newArrayError);

    let newArray = [...dataQA];
    newArray.splice(index, 1);
    setDataQA(newArray);
  };

  const validateAll = () => {
    setErrorAnalyst(prev =>
      prev.map((er, i) => dataAnalyst[i].karyawan ? noErr : err)
    );
    setErrorUser(prev =>
      prev.map((er, i) => dataUser[i].karyawan ? noErr : err)
    );
    setErrorQA(prev =>
      prev.map((er, i) => dataQA[i].karyawan ? noErr : err)
    );
    if (dataAnalyst.every(dt => dt.karyawan) && dataUser.every(dt => dt.karyawan) && dataQA.every(dt => dt.karyawan)) return true;
    else return false;
  };

  const simpan = () => {
    setLoadingButton(true);
    if (dataAnalyst.length > 0 && dataUser.length > 0 && dataQA.length > 0) {
      if (validateAll()) {
        const listdetail = {
          analis: dataAnalyst.map(d => d.karyawan.nik),
          user: dataUser.map(d => d.karyawan.nik),
          qa: dataQA.map(d => d.karyawan.nik)
        };
        const formatData = {
          idproj: proyek.IDPROYEK,
          iduat: uat.IDUAT || null,
          listdetail: listdetail
        };
        if (edit) {
          updateUat(formatData)
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
        } else {
          createUat(formatData)
            .then((response) => {
              setAlertDialog({ openAlertDialog: true, messageAlertDialog: "Berhasil simpan", severity: "success" });
              refresh();
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
      setAlertDialog({ openAlertDialog: true, messageAlertDialog: "System Analyst/Tim Fungsional, User, Quality Control tidak boleh kosong. Silahkan periksa data yang anda masukkan.", severity: "warning" });
      setLoadingButton(false);
    }
  };

  return (
    <Grid container direction="column" spacing={2}>
      <AlertDialog
        open={alertDialog.openAlertDialog}
        id="alert-dialog"
        onClose={alertDialog.severity === "success" ? () => { handleCloseAlertDialog(); onClose(); } : handleCloseAlertDialog}
        message={alertDialog.messageAlertDialog}
        severity={alertDialog.severity}
      />
      <Grid item>
        <Typography variant="h4" gutterBottom>
          {edit ? "Ubah UAT (User Acceptence Test)" : "Tambah UAT (User Acceptence Test)"}
        </Typography>
      </Grid>
      <Divider />
      <Grid item xs={6}>
        <TextField id="nomor"
          label="Nomor UAT"
          fullWidth
          disabled
          className={classes.fieldDisabled}
          value={nomor}
        />
      </Grid>
      <Grid item >
        <Tabel label="System Analyst / Tim Fungsional"
          listKaryawan={listKaryawan ? listKaryawan.filter(d => d.organisasi.search("IT") !== -1) : []}
          data={dataAnalyst}
          error={errorAnalyst}
          addRow={addRowAnalyst}
          deleteRow={deleteRowAnalyst}
          handleChange={handleChangeAnalyst}
        />
      </Grid>
      <Grid item >
        <Tabel label="User"
          listKaryawan={listKaryawan}
          data={dataUser}
          error={errorUser}
          addRow={addRowUser}
          deleteRow={deleteRowUser}
          handleChange={handleChangeUser}
        />
      </Grid>
      <Grid item >
        <Tabel label="Quality Control"
          listKaryawan={listKaryawan ? listKaryawan.filter(d => d.nik === "930324" || d.nik ==="920672" || d.nik === "140290" || d.nik === "950003") : []}
          data={dataQA}
          error={errorQA}
          addRow={addRowQA}
          deleteRow={deleteRowQA}
          handleChange={handleChangeQA}
        />
      </Grid>
      <Divider />
      <Grid item container direction="row" justify="flex-end">
        <Button onClick={loadingButton ? null : simpan} variant="contained" color="primary">
          {loadingButton ? <CircularProgress size={20} color="inherit" /> : edit ? "Ubah" : "Simpan"}
        </Button>
        <Button onClick={onClose} variant="contained" color="inherit" style={{ marginLeft: 10 }}>
          {"Batal"}
        </Button>
      </Grid>
    </Grid>
  );
};

function Tabel(props) {
  const { label, listKaryawan, data, error, addRow, deleteRow, handleChange } = props;
  const classes = useStyles();
  return <Paper className={classes.paper}>
    <Grid container direction="column" spacing={2}>
      <Grid item container direction="row" justify="space-between">
        <Grid item xs>
          <Typography variant="h6">{label}</Typography>
        </Grid>
      </Grid>
      <Grid item container direction="column" spacing={1}>
        <Grid item container direction="row" spacing={1} justify="space-between">
          <Grid item xs={2}>
            <Typography align="center" variant="body2"><b>NIK</b></Typography>
          </Grid>
          <Grid item xs>
            <Typography align="center" variant="body2"><b>Nama</b></Typography>
          </Grid>
          <Grid item xs>
            <Typography align="center" variant="body2"><b>Unit Organisasi</b></Typography>
          </Grid>
          <Grid item xs={1}>
            <Typography align="center" variant="body2"><b>Actions</b></Typography>
          </Grid>
        </Grid>
        {data && data.map((d, i) =>
          <Grid item key={"grid-cont-" + i} container direction="row" spacing={1} justify="space-between" alignItems="center">
            <Grid key={"grid-nik-" + i} item xs={2}>
              <Autocomplete key={"nik-" + i} id={"nik-" + i} name={"nik-" + i}
                options={listKaryawan || []}
                getOptionLabel={option => option.nik}
                onChange={(e, v) => handleChange(v, i)}
                value={d.karyawan}
                getOptionSelected={
                  (option, value) => option.nik === value.nik
                }
                renderOption={(option) => (
                  <React.Fragment>
                    {option.nik + " / " + option.nama + " / " + option.organisasi}
                  </React.Fragment>
                )}
                renderInput={params => (
                  <TextField
                    {...params}
                    fullWidth
                    variant={"outlined"}
                    size="small"
                    error={error[i].error}
                    helperText={error[i].text}
                  />
                )}
                disabled={d.disabled}
              />
            </Grid>
            <Grid key={"grid-nama-" + i} item xs>
              <TextField key={"nama-" + i} id={"nama-" + i} name={"nama-" + i}
                fullWidth
                multiline
                size="small"
                value={d.nama}
                disabled
                className={classes.fieldDisabled}
              />
            </Grid>
            <Grid key={"grid-org-" + i} item xs>
              <TextField key={"org-" + i} id={"org-" + i} name={"org-" + i}
                fullWidth
                multiline
                size="small"
                value={d.org}
                disabled
                className={classes.fieldDisabled}
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
  </Paper>;
}