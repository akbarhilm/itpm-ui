import React, { useState, useEffect } from 'react';
import { Grid, Typography, Button, TextField, makeStyles, Paper, IconButton, Checkbox } from '@material-ui/core';
import AlertDialog from '../../components/AlertDialog';
import { AddCircleOutline, RemoveCircleOutline, CheckBoxOutlineBlank, CheckBox } from '@material-ui/icons';
import { KeyboardDatePicker } from '@material-ui/pickers';
import { Autocomplete } from '@material-ui/lab';

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

const defaultData = {};

export default function RencanaPelaksanaan(props) {
  const { proyek } = props;
  const classes = useStyles();

  const [edit, setEdit] = useState(false);
  const [data, setData] = useState();
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
        // setError("response dari get ureq di looping set defaultError");
      } else {
        setData([defaultData]);
        // setError([defaultError]);
      }
    }
  }, [data, proyek]);

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
          value={""}
        />
      </Grid>
      <Grid item >
        <Paper className={classes.paper}>
          <Grid container direction="column" spacing={2}>
            <Grid item container direction="row" justify="space-between">
              <Grid item xs>
                <Typography variant="h6">Data Rencana</Typography>
              </Grid>
              <Grid item xs container justify="flex-end">
                {/* <IconButton size="small" onClick={addRow}> */}
                <IconButton size="small" >
                  <AddCircleOutline />
                </IconButton>
              </Grid>
            </Grid>
            <Grid item container direction="column" spacing={1}>
              <Grid item container direction="row" spacing={1} justify="space-between">
                <Grid item xs={3}>
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
                <Grid item key={"grid-cont-" + i} container direction="row" spacing={1} justify="space-between" alignItems="center">
                  <Grid key={"grid-kegiatan-" + i} item xs={3}>
                    <TextField key={"kegiatan-" + i} id={"kegiatan-" + i} name={"kegiatan-" + i}
                      variant="outlined"
                      fullWidth
                      multiline
                      size="small"
                    // value={d.kebutuhan}
                    // onChange={(event) => handleChange(event.target.value, i, "kebutuhan")}
                    // error={error[i].kebutuhan.error}
                    // helperText={error[i].kebutuhan.text}
                    />
                  </Grid>
                  <Grid key={"grid-pelaksana-" + i} item xs={2}>
                    <Autocomplete id="kantorCabang"
                      multiple
                      disableCloseOnSelect
                      // disabled={disabled}
                      options={[]}
                      getOptionLabel={option => option.name}
                      // onChange={(e, v) => handleChangeAutoComplete(e, v, "kantorCabang")}
                      // onClose={() => {
                      //   setListKantorCabang([]);
                      // }}
                      getOptionSelected={
                        (option, value) => option.branchId === value.branchId
                      }
                      renderOption={(option, { selected }) => (
                        <React.Fragment>
                          <Checkbox
                            icon={<CheckBoxOutlineBlank fontSize="small" />}
                            checkedIcon={<CheckBox fontSize="small" />}
                            style={{ marginRight: 6 }}
                            checked={selected}
                          />
                          {option.name}, {option.kanwil}
                        </React.Fragment>
                      )}
                      renderInput={params => (
                        <TextField
                          {...params}
                          // label="Kantor Cabang"
                          fullWidth
                          variant="outlined"
                          size="small"
                        // required
                        // error={error.kantorCabang.error}
                        // helperText={error.kantorCabang.text}
                        />
                      )}
                    />
                  </Grid>
                  <Grid key={"grid-mulai-" + i} item xs={2}>
                    <KeyboardDatePicker
                      fullWidth
                      clearable
                      id={"tanggalMulai" + i}
                      format="DD/MM/YYYY"
                      size="small"
                      // label="Tanggal Mulai"
                      // value={d.tanggalMulai}
                      // onChange={(value) => handleChangeDate(value, i, "tanggalMulai")}
                      // required
                      // error={error[i].tanggalMulai.error}
                      // helperText={error[i].tanggalMulai.text}
                      // disabled={disabled}
                      inputVariant="outlined"
                      views={['year', 'month', 'date']}
                    />
                  </Grid>
                  <Grid key={"grid-selesai-" + i} item xs={2}>
                    <KeyboardDatePicker
                      fullWidth
                      clearable
                      id={"tanggalSelesai" + i}
                      format="DD/MM/YYYY"
                      size="small"
                      // label="Tanggal Mulai"
                      // value={d.tanggalMulai}
                      // onChange={(value) => handleChangeDate(value, i, "tanggalMulai")}
                      // required
                      // error={error[i].tanggalMulai.error}
                      // helperText={error[i].tanggalMulai.text}
                      // disabled={disabled}
                      inputVariant="outlined"
                      views={['year', 'month', 'date']}
                    />
                  </Grid>
                  <Grid key={"grid-target-" + i} item xs={2}>
                    <TextField key={"target-" + i} id={"target-" + i} name={"target-" + i}
                      variant="outlined"
                      fullWidth
                      size="small"
                    // value={d.useCase}
                    // onChange={(event) => handleChange(event.target.value, i, "useCase")}
                    // error={error[i].useCase.error}
                    // helperText={error[i].useCase.text}
                    />
                  </Grid>
                  <Grid item xs={1} container justify="center">
                    {/* <IconButton size="small" onClick={() => deleteRow(i)}> */}
                    <IconButton size="small" >
                      <RemoveCircleOutline />
                    </IconButton>
                  </Grid>
                </Grid>
              )}

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