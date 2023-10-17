import React, { useState, useEffect, useCallback } from 'react';
import { Grid, Typography, Button, TextField, IconButton, Paper, makeStyles, CircularProgress, Divider, InputLabel, MenuItem, RadioGroup, FormControlLabel, Radio } from '@material-ui/core';
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
const defaultDataTambahan = [
  { code: "STORAGE", deskripsi: "", satuan: "GB", jumlah: "0" },
  { code: "USER", deskripsi: "", satuan: "usr", jumlah: "0" },
  { code: "SERVER", deskripsi: "", satuan: "buah", jumlah: "0" },
  { code: "NETWORK", deskripsi: "", satuan: "-", jumlah: "0" },
  { code: "BACKUP", deskripsi: "", satuan: "-", jumlah: "0" },
];

// const defaultErrorDataTambahan = [
//   { code: "STORAGE", error: false, text: "" },
//   { code: "USER", error: false, text: "" },
//   { code: "SERVER", error: false, text: "" },
//   { code: "NETWORK", error: false, text: "" },
//   { code: "BACKUP", error: false, text: "" },
// ];

const pilihServer = ["server yang sudah ada", "server dengan kebutuhan khusus"];

const err = { error: true, text: "Tidak boleh kosong." };
const noErr = { error: false, text: "" };
const defaultError = { deskripsi: noErr, satuan: noErr, jumlah: noErr };

export default function Resource(props) {
  const { resource, proyek } = props;
  const classes = useStyles();

  const [loadingButton, setLoadingButton] = useState(false);
  const [edit, setEdit] = useState(false);
  const [nomor, setNomor] = useState("");
  const [data, setData] = useState([]);
  const [error, setError] = useState([]);
  const [alertDialog, setAlertDialog] = useState(defaultAlert);

  const [dataTambahan, setDataTambahan] = useState(defaultDataTambahan);
  // const [errorDataTambahan, setErrorDataTambahan] = useState(defaultErrorDataTambahan);

  const handleChangeDataTambahan = (value, code) => {
    const datas = [...dataTambahan];
    const findData = dataTambahan.find(d => d.code === code);
    const newData = {
      ...findData,
      deskripsi: value ? value : "",
    };
    const index = dataTambahan.findIndex(d => d.code === code);
    datas[index] = newData;
    if ((code === 'USER' && !isNaN(value) && validateLength100(value)) || (code !== 'USER' && validateLength100(value)))
      setDataTambahan(datas);
    // else 
    // if (validateLength100(value))
    //   setDataTambahan(datas);
  };

  const handleCloseAlertDialog = () => {
    setAlertDialog({ ...alertDialog, openAlertDialog: false });
  };

  const formatNewData = useCallback((listdetail) => {
    const newData = [];
    listdetail.forEach(data => {
      newData.push({
        // code: data.CODE || "",
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
        const newData = formatNewData(resource.LISTDETAIL.filter(d => !d.KODE));
        setData(newData);
        setError(newData.map(d => defaultError));
        const newDataTambahan = defaultDataTambahan.map(dt => {
          const dataFilter = resource.LISTDETAIL.filter(d => d.KODE === dt.code);
          if (dataFilter.length > 0) return { code: dt.code, deskripsi: dataFilter[0].NAMARESOURCE, satuan: dt.satuan, jumlah: dt.jumlah };
          return dt;
        });
        setDataTambahan(newDataTambahan);
      }
      // else {
      //   setData([defaultData]);
      //   setError([defaultError]);
      // }
    }
    // else {
    //   setData([defaultData]);
    //   setError([defaultError]);
    // }
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
    if ((data.length > 0 && data.every(dt => dt.deskripsi && dt.satuan && dt.jumlah)) || dataTambahan.some(dt => dt.deskripsi && dt.satuan && dt.jumlah)) return true;
    else return false;
  };

  const simpan = () => {
    setLoadingButton(true);
    // if (data.length > 0) {
    if (validateAll()) {
      const listData = data.map(dt => ({
        kode: "",
        namaresource: dt.deskripsi,
        kodeuom: dt.satuan,
        quantity: dt.jumlah,
      }));
      const listDataTambahan = dataTambahan.filter(d => d.deskripsi).map(dt => ({
        kode: dt.code,
        namaresource: dt.deskripsi,
        kodeuom: dt.satuan,
        quantity: dt.jumlah,
      }));
      const formatData = {
        idproj: proyek.IDPROYEK,
        listdetail: listDataTambahan.concat(listData)
      };
      // console.log(formatData);
      if (edit) {
        updateResource(formatData)
          .then((response) => {
            setData(formatNewData(response.data.LISTDETAIL.filter(d => !d.KODE)));
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
            setData(formatNewData(response.data.LISTDETAIL.filter(d => !d.KODE)));
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
      //   // console.log("simpan");
      //   // console.log("format data", formatData);
      //   setLoadingButton(false);
      // }, 2000);
    } else {
      setAlertDialog({ openAlertDialog: true, messageAlertDialog: "Silahkan periksa data yang anda masukkan. Minimal ada satu data yang diisi.", severity: "warning" });
      setLoadingButton(false);
    }
    // } else {
    //   setAlertDialog({ openAlertDialog: true, messageAlertDialog: "Data kosong. Silahkan periksa data yang anda masukkan.", severity: "warning" });
    //   setLoadingButton(false);
    // }
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
            <Grid item container direction="row" justifyContent="space-between">
              <Grid item xs>
                <Typography variant="h6">Sumber Daya Lain</Typography>
              </Grid>
            </Grid>
            <Grid item container spacing={1}>
              <Grid item container direction='row' alignItems='center'>
                <Grid item xs={4}>
                  <InputLabel>Estimasi media penyimpanan pertahun</InputLabel>
                </Grid>
                <TextField variant='outlined'
                  size='small'
                  value={dataTambahan.find(d => d.code === 'STORAGE').deskripsi}
                  onChange={(e) => handleChangeDataTambahan(e.target.value, 'STORAGE')}
                  style={{ marginLeft: '10px' }}
                />
              </Grid>
              <Grid item container direction='row' alignItems='center'>
                <Grid item xs={4}>
                  <InputLabel>Jumlah user</InputLabel>
                </Grid>
                <TextField variant='outlined'
                  size='small'
                  value={dataTambahan.find(d => d.code === 'USER').deskripsi}
                  onChange={(e) => handleChangeDataTambahan(e.target.value, 'USER')}
                  style={{ marginLeft: '10px' }}
                // inputProps={{ style: { textAlign: 'right' } }}
                />
              </Grid>
              <Grid item container direction='row' alignItems='center'>
                <Grid item xs={4}>
                  <InputLabel>Infrastruktur yang akan digunakan</InputLabel>
                </Grid>
                <Grid item xs>
                  <TextField
                    select
                    variant="outlined"
                    size='small'
                    value={[pilihServer[0], ""].includes(dataTambahan.find(d => d.code === 'SERVER').deskripsi)
                      ? dataTambahan.find(d => d.code === 'SERVER').deskripsi
                      : pilihServer[pilihServer.length - 1]}
                    onChange={(e) => handleChangeDataTambahan(e.target.value, 'SERVER')}
                    style={{ marginLeft: '10px' }}
                  >
                    <MenuItem value={""}>
                      <em>Pilih</em>
                    </MenuItem>
                    {pilihServer.map((d, i) => (<MenuItem key={"pilih-server-" + i} value={d}>{d}</MenuItem>))}
                  </TextField>
                  {![pilihServer[0], ""].includes(dataTambahan.find(d => d.code === 'SERVER').deskripsi)
                    ? <TextField
                      multiline
                      variant="outlined"
                      size='small'
                      value={dataTambahan.find(d => d.code === 'SERVER').deskripsi !== pilihServer[pilihServer.length - 1]
                        ? dataTambahan.find(d => d.code === 'SERVER').deskripsi
                        : ""}
                      onChange={(e) => handleChangeDataTambahan(e.target.value, 'SERVER')}
                      style={{ marginLeft: '10px' }}
                    />
                    : null
                  }
                </Grid>
              </Grid>
              <Grid item container direction='row' alignItems='center'>
                <Grid item xs={4}>
                  <InputLabel>Kebutuhan jaringan</InputLabel>
                </Grid>
                <RadioGroup row
                  value={dataTambahan.find(d => d.code === 'NETWORK').deskripsi ? dataTambahan.find(d => d.code === 'NETWORK').deskripsi : null}
                  onChange={(e) => handleChangeDataTambahan(e.target.value, 'NETWORK')}
                  style={{ marginLeft: '10px' }}
                >
                  <FormControlLabel value="internet" control={<Radio />} label="Internet" />
                  <FormControlLabel value="intranet" control={<Radio />} label="Intranet" />
                </RadioGroup>
              </Grid>
              <Grid item container direction='row' alignItems='center'>
                <Grid item xs={4}>
                  <InputLabel>Permintaan khusus dari user untuk backup data (jika ada)</InputLabel>
                </Grid>
                <TextField
                  multiline
                  variant="outlined"
                  size='small'
                  value={dataTambahan.find(d => d.code === 'BACKUP').deskripsi}
                  onChange={(e) => handleChangeDataTambahan(e.target.value, 'BACKUP')}
                  style={{ marginLeft: '10px' }}
                />
              </Grid>
              {/* <Grid item container direction='row' alignItems='center'>
                <Grid item xs={4}>
                  <InputLabel>Kebutuhan lainnya</InputLabel>
                </Grid>
              </Grid> */}
            </Grid>
            <Divider variant='middle' style={{ marginTop: '20px', marginBottom: '20px' }} />
            <Grid item>
              <InputLabel>Kebutuhan lainnya</InputLabel>
            </Grid>
            <Grid item container direction="column" spacing={1}>
              <Grid item container direction="row" spacing={1} justifyContent="space-between">
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
                <Grid item key={"grid-cont-" + i} container direction="row" spacing={1} justifyContent="space-between" alignItems="center">
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
