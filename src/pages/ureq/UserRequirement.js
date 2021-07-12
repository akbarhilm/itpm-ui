import React, { useState, useEffect } from 'react';
import { Grid, Typography, Button, TextField, IconButton, Paper, makeStyles } from '@material-ui/core';
import { AddBoxOutlined, RemoveCircleOutline } from '@material-ui/icons';
import AlertDialog from '../../components/AlertDialog';

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

const defaultData = { kebutuhan: "", rincian: "", useCase: "" };

const err = { error: true, text: "Tidak boleh kosong." };
const noErr = { error: false, text: "" };
const defaultError = { kebutuhan: noErr, rincian: noErr, useCase: noErr };

export default function UserRequirement(props) {
  const { proyek } = props;
  const classes = useStyles();
  const [edit, setEdit] = useState(false);
  const [data, setData] = useState();
  const [error, setError] = useState();
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
        setError("response dari get ureq di looping set defaultError");
      } else {
        setData([defaultData]);
        setError([defaultError]);
      }
    }
  }, [data, proyek]);

  const handleChange = (value, index, key) => {
    let newArray = [...data];
    newArray[index] = { ...newArray[index], [key]: value };
    // console.log(newArray[index]);
    setData(newArray);
  };

  const addRow = () => {
    let newArray = [...data];
    newArray.push(defaultData);
    setData(newArray);
  };

  const deleteRow = (index) => {
    let newArray = [...data];
    newArray.splice(index, 1);
    setData(newArray);
  };

  return (
    <Grid container direction="column" spacing={3}>
      <AlertDialog
        open={alertDialog.openAlertDialog}
        id="alert-dialog"
        onClose={handleCloseAlertDialog}
        message={alertDialog.messageAlertDialog}
        severity={alertDialog.severity}
      />
      <Grid item>
        <Typography variant="h4" gutterBottom>
          {edit ? "Ubah Kebutuhan Pengguna" : "Tambah Kebutuhan Pengguna"}
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
                <Typography variant="h6">Data Requirement</Typography>
              </Grid>
              <Grid item xs container justify="flex-end">
                <IconButton size="small" onClick={addRow}>
                  <AddBoxOutlined />
                </IconButton>
              </Grid>
            </Grid>
            <Grid item container direction="column" spacing={1}>
              <Grid item container direction="row" spacing={1} justify="space-between">
                <Grid item xs={4}>
                  <Typography align="center">Kebutuhan Sistem</Typography>
                </Grid>
                <Grid item xs={5}>
                  <Typography align="center">Rincian Kebutuhan</Typography>
                </Grid>
                <Grid item xs={2}>
                  <Typography align="center">Use Case</Typography>
                </Grid>
                <Grid item xs={1}>
                  <Typography align="center">Actions</Typography>
                </Grid>
              </Grid>
              {data && data.map((d, i) =>
                <Grid item key={"grid-cont-" + i} container direction="row" spacing={1} justify="space-between" alignItems="center">
                  <Grid key={"grid-kebutuhan-" + i} item xs={4}>
                    <TextField key={"kebutuhan-" + i} id={"kebutuhan-" + i} name={"kebutuhan-" + i}
                      variant="outlined"
                      fullWidth
                      multiline
                      size="small"
                      value={d.kebutuhan}
                      onChange={(event) => handleChange(event.target.value, i, "kebutuhan")}
                    />
                  </Grid>
                  <Grid key={"grid-rincian-" + i} item xs={5}>
                    <TextField key={"rincian-" + i} id={"rincian-" + i} name={"rincian-" + i}
                      variant="outlined"
                      fullWidth
                      multiline
                      size="small"
                      value={d.rincian}
                      onChange={(event) => handleChange(event.target.value, i, "rincian")}
                    />
                  </Grid>
                  <Grid key={"grid-use-case-" + i} item xs={2}>
                    <TextField key={"use-case-" + i} id={"use-case-" + i} name={"use-case-" + i}
                      variant="outlined"
                      fullWidth
                      size="small"
                      value={d.useCase}
                      onChange={(event) => handleChange(event.target.value, i, "useCase")}
                    />
                  </Grid>
                  <Grid item xs={1} container justify="center">
                    <IconButton size="small" onClick={() => deleteRow(i)}>
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
        <Button variant="contained" color="primary">
          {"Simpan"}
        </Button>
      </Grid>
    </Grid>
  );
};
