import React, { useState, useEffect } from 'react';
import { Grid, Typography, Button, TextField, makeStyles, Paper, IconButton, Checkbox } from '@material-ui/core';
import AlertDialog from '../../components/AlertDialog';
import { AddCircleOutline, RemoveCircleOutline, CheckBoxOutlineBlank, CheckBox } from '@material-ui/icons';
import { KeyboardDatePicker } from '@material-ui/pickers';
import { Autocomplete } from '@material-ui/lab';

const dummyKegiatan = [
  { id: 1, kegiatan: "Initiation", target: "Dokumen 1" },
  { id: 2, kegiatan: "Development", target: "Dokumen 2" },
  { id: 3, kegiatan: "Testing", target: "Dokumen 3" },
  { id: 4, kegiatan: "Deploy", target: "Dokumen 4" },
];

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

export default function RencanaPelaksanaan(props) {
  const { proyek } = props;
  const classes = useStyles();

  const [edit, setEdit] = useState(false);
  const [nomor, setNomor] = useState("");
  const [data, setData] = useState();
  const [listKegiatan, setListKegiatan] = useState();
  const [listKaryawan, setListKaryawan] = useState();
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
        setNomor("set dari response");
        // setError("response dari get ureq di looping set defaultError");
      } else {
        setData([defaultData]);
        // setError([defaultError]);
      }
    }
  }, [data, proyek]);

  useEffect(() => {
    if (!listKegiatan) {
      setListKegiatan(dummyKegiatan);
    }
  }, [listKegiatan]);

  useEffect(() => {
    if (!listKaryawan) {
      setListKaryawan(dummyKaryawan);
    }
  }, [listKaryawan]);

  const handleChange = (value, index, jenis) => {
    let newArray = [...data];
    if (jenis === "kegiatan") {
      newArray[index] = { ...newArray[index], [jenis]: value, target: value ? value.target : "" };
    } else {
      newArray[index] = { ...newArray[index], [jenis]: value };
    }
    setData(newArray);
  };

  const addRow = () => {
    // let newArrayError = [...error];
    // newArrayError.push(defaultError);
    // setError(newArrayError);

    let newArray = [...data];
    newArray.push(defaultData);
    setData(newArray);
  };

  const deleteRow = (index) => {
    // let newArrayError = [...error];
    // newArrayError.splice(index, 1);
    // setError(newArrayError);

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
          {edit ? "Ubah Rencana Pelaksanaan" : "Tambah Rencana Pelaksanaan"}
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
                <Typography variant="h6">Data Rencana</Typography>
              </Grid>
              {/* <Grid item xs container justify="flex-end">
                <IconButton size="small" onClick={addRow}>
                <IconButton size="small" >
                  <AddCircleOutline />
                </IconButton>
              </Grid> */}
            </Grid>
            <Grid item container direction="column" spacing={1}>
              <Grid item container direction="row" spacing={1} justify="space-between">
                <Grid item xs>
                  <Typography align="center">Kegiatan</Typography>
                </Grid>
                <Grid item xs={2}>
                  <Typography align="center">Pelaksana</Typography>
                </Grid>
                <Grid item xs={2}>
                  <Typography align="center">Tanggal Mulai</Typography>
                </Grid>
                <Grid item xs={2}>
                  <Typography align="center">Tanggal Selesai</Typography>
                </Grid>
                <Grid item xs={2}>
                  <Typography align="center">Target</Typography>
                </Grid>
                <Grid item xs={1}>
                  <Typography align="center">Actions</Typography>
                </Grid>
              </Grid>
              {data && data.map((d, i) =>
                <Grid item key={"grid-cont-" + i} container direction="row" spacing={1} justify="space-between" alignItems="flex-start">
                  <Grid key={"grid-kegiatan-" + i} item xs>
                    <Autocomplete key={"kegiatan-" + i} id={"kegiatan-" + i} name={"kegiatan-" + i}
                      options={listKegiatan}
                      getOptionLabel={option => option.kegiatan}
                      onChange={(e, v) => handleChange(v, i, "kegiatan")}
                      value={d.kegiatan}
                      // onClose={() => {
                      //   setListKantorCabang([]);
                      // }}
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
                          variant="outlined"
                          size="small"
                        // error={error.kantorCabang.error}
                        // helperText={error.kantorCabang.text}
                        />
                      )}
                    />
                  </Grid>
                  <Grid key={"grid-pelaksana-" + i} item xs={2}>
                    <Autocomplete key={"pelaksana-" + i} id={"pelaksana-" + i} name={"pelaksana-" + i}
                      multiple
                      disableCloseOnSelect
                      options={listKaryawan}
                      value={d.pelaksana}
                      getOptionLabel={option => option.nik}
                      onChange={(e, v) => handleChange(v, i, "pelaksana")}
                      // onClose={() => {
                      //   setListKantorCabang([]);
                      // }}
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
                        // error={error.kantorCabang.error}
                        // helperText={error.kantorCabang.text}
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
                      onChange={(value) => handleChange(value, i, "tanggalMulai")}
                      // error={error[i].tanggalMulai.error}
                      // helperText={error[i].tanggalMulai.text}
                      // disabled={disabled}
                      inputVariant="outlined"
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
                      onChange={(value) => handleChange(value, i, "tanggalSelesai")}
                      // error={error[i].tanggalMulai.error}
                      // helperText={error[i].tanggalMulai.text}
                      // disabled={disabled}
                      inputVariant="outlined"
                      views={['year', 'month', 'date']}
                    />
                  </Grid>
                  <Grid key={"grid-target-" + i} item xs={2}>
                    <TextField key={"target-" + i} id={"target-" + i} name={"target-" + i}
                      multiline
                      variant="outlined"
                      fullWidth
                      size="small"
                      value={d.target}
                      disabled
                      className={classes.fieldTableDisabled}
                    // onChange={(event) => handleChange(event.target.value, i, "useCase")}
                    // error={error[i].useCase.error}
                    // helperText={error[i].useCase.text}
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