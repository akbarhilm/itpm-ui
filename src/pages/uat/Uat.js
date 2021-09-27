import React, { useState, useEffect } from 'react';
import { Grid, Typography, Button, TextField, makeStyles, Divider, CircularProgress } from '@material-ui/core';
import AlertDialog from '../../components/AlertDialog';
// import { AddCircleOutline, RemoveCircleOutline, CheckBoxOutlineBlank, CheckBox } from '@material-ui/icons';
// import { KeyboardDatePicker } from '@material-ui/pickers';
// import { Autocomplete } from '@material-ui/lab';

const dummyKaryawan = [
  { nik: "160035", nama: "M. MUSTAKIM", kodeOrganisasi: "IT1300" },
  { nik: "160257", nama: "ANITA IKA NURCAHYANI", kodeOrganisasi: "IT1300" },
  { nik: "170084", nama: "AKBAR HILMAN", kodeOrganisasi: "IT1300" },
  { nik: "160260", nama: "ERVIN ADHI CAHYA N", kodeOrganisasi: "IT3100" },
  { nik: "180136", nama: "ANNISA DWIDYA R", kodeOrganisasi: "IT1100" },
  { nik: "900147", nama: "RINI ASTUTI", kodeOrganisasi: "IT1000" },
];

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

// const err = { error: true, text: "Tidak boleh kosong." };
// const noErr = { error: false, text: "" };
// const defaultError = { kegiatan: noErr, pelaksana: noErr, tanggalMulai: noErr, tanggalSelesai: noErr };

export default function Realisasi(props) {
  const { uat, proyek } = props;
  const classes = useStyles();

  const [loadingButton, setLoadingButton] = useState(false);
  const [edit, setEdit] = useState(false);
  const [nomor, setNomor] = useState("");
  const [data, setData] = useState();
  // const [error, setError] = useState();
  const [listKaryawan, setListKaryawan] = useState();
  const [alertDialog, setAlertDialog] = useState(defaultAlert);

  const handleCloseAlertDialog = () => {
    setAlertDialog({ ...alertDialog, openAlertDialog: false });
  };

  useEffect(() => {
    // setListModul([]);
    // if (!data) {
    // console.log(proyek);
    // get ureq then
    if (Object.keys(uat).length > 0) {
      setEdit(true);
      setData("response dari get ureq");
      setNomor("set dari response");
      // setError("response dari get ureq di looping set defaultError");
    } else {
      setData([defaultData]);
      // setError([defaultError]);
    }
    // }
  }, [uat]);

  useEffect(() => {
    if (!listKaryawan) {
      setListKaryawan(dummyKaryawan);
    }
  }, [listKaryawan]);

  // const handleChange = (value, index, key) => {
  //   let newArrayError = [...error];
  //   if (key === "pelaksana")
  //     newArrayError[index] = { ...newArrayError[index], [key]: value.length > 0 ? noErr : err };
  //   else
  //     newArrayError[index] = { ...newArrayError[index], [key]: value ? noErr : err };
  //   setError(newArrayError);

  //   let newArray = [...data];
  //   if (key === "kegiatan") {
  //     newArray[index] = { ...newArray[index], [key]: value, target: value ? value.target : "" };
  //   } else {
  //     newArray[index] = { ...newArray[index], [key]: value };
  //   }
  //   setData(newArray);
  // };

  // const addRow = () => {
  //   let newArrayError = [...error];
  //   newArrayError.push(defaultError);
  //   setError(newArrayError);

  //   let newArray = [...data];
  //   newArray.push(defaultData);
  //   setData(newArray);
  // };

  // const deleteRow = (index) => {
  //   let newArrayError = [...error];
  //   newArrayError.splice(index, 1);
  //   setError(newArrayError);

  //   let newArray = [...data];
  //   newArray.splice(index, 1);
  //   setData(newArray);
  // };

  const validateAll = () => {
    // setError(prev =>
    //   prev.map((er, i) => {
    //     const newObj = {
    //       kegiatan: data[i].kegiatan ? noErr : err,
    //       pelaksana: data[i].pelaksana.length > 0 ? noErr : err,
    //       tanggalMulai: data[i].tanggalMulai ? noErr : err,
    //       tanggalSelesai: data[i].tanggalSelesai ? noErr : err
    //     };
    //     return newObj;
    //   })
    // );
    if (data.every(dt => dt.kegiatan && dt.pelaksana.length > 0 && dt.tanggalMulai && dt.tanggalSelesai)) return true;
    else return false;
  };

  const simpan = () => {
    setLoadingButton(true);
    if (data.length > 0) {
      if (validateAll()) {
        const listdetail = data.map(dt => ({
          idplan: dt.idplan ? dt.idplan : null,
          kegiatan: dt.kegiatan,
          pelaksana: dt.pelaksana,
          tanggalMulai: dt.tanggalMulai,
          tanggalSelesai: dt.tanggalSelesai
        }));
        const formatData = {
          idproyek: proyek.IDPROYEK,
          listdetail: listdetail
        };
        setTimeout(() => {
          console.log("simpan");
          console.log("format data", formatData);
          setLoadingButton(false);
        }, 2000);
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

      <Divider />
      <Grid item container direction="row" justify="flex-end">
        <Button onClick={loadingButton ? null : simpan} variant="contained" color="primary">
          {loadingButton ? <CircularProgress size={20} color="inherit" /> : edit ? "Ubah" : "Simpan"}
        </Button>
      </Grid>
    </Grid>
  );
};