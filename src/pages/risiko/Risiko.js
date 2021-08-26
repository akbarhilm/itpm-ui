import React, { useState, useEffect } from 'react';
import { Grid, Button, Typography, CircularProgress, makeStyles, TextField, Divider, Paper, IconButton, MenuItem } from '@material-ui/core';
import AlertDialog from '../../components/AlertDialog';
import { RemoveCircleOutline, AddCircleOutline } from '@material-ui/icons';
import { kemungkinan, dampak } from '../../utils/DataEnum';

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
      color: "rgba(0, 0, 0, 1)"
    }
  },
}));

const defaultAlert = { openAlertDialog: false, messageAlertDialog: "", severity: "info" };

const defaultListFaktor = { deskripsi: "", kemungkinan: "", dampak: "", tingkatRisiko: "" };
const defaultListPenanganan = { faktor: "", deskripsi: "", kemungkinan: "", dampak: "", tingkatRisiko: "" };

const err = { error: true, text: "Tidak boleh kosong." };
const noErr = { error: false, text: "" };
const defaultError = { faktor: noErr, deskripsi: noErr, kemungkinan: noErr, dampak: noErr, tingkatRisiko: noErr };

export default function Risiko(props) {
  const { risiko, proyek } = props;

  const classes = useStyles();

  const [loadingButton, setLoadingButton] = useState(false);
  const [edit, setEdit] = useState(false);
  const [listDataFaktor, setListDataFaktor] = useState();
  const [listDataPenanganan, setListDataPenanganan] = useState();
  const [nomor, setNomor] = useState("");
  const [errorFaktor, setErrorFaktor] = useState();
  const [errorPenanganan, setErrorPenanganan] = useState();
  const [alertDialog, setAlertDialog] = useState(defaultAlert);

  const handleCloseAlertDialog = () => {
    setAlertDialog({ ...alertDialog, openAlertDialog: false });
  };

  useEffect(() => {
    // setListModul([]);
    // if (!data) {
    // console.log(proyek);
    // get ureq then
    if (Object.keys(risiko).length > 0) {
      setEdit(true);
      setNomor("nomor risiko");
      // setListDataFaktor([defaultListFaktor]);
      // setListDataPenanganan([]);
      // setErrorFaktor()
      // setErrorPenanganan()
    } else {
      // console.log("tes");
      setListDataFaktor([defaultListFaktor]);
      setListDataPenanganan([]);
      setErrorFaktor([defaultError]);
      setErrorPenanganan([]);
    }
    // }
  }, [risiko]);

  const addRowFaktor = () => {
    let newError = [...errorFaktor];
    newError.push(defaultError);
    setErrorFaktor(newError);

    let newArray = [...listDataFaktor];
    newArray.push(defaultListFaktor);
    setListDataFaktor(newArray);
  };

  const handleChangeFaktor = (value, index, key) => {
    let newError = [...errorFaktor];
    newError[index] = { ...newError[index], [key]: value ? noErr : err };
    setErrorFaktor(newError);

    let newArray = [...listDataFaktor];
    newArray[index] = { ...newArray[index], [key]: value };
    const riskrate = hitungTingkatRisiko(parseInt(newArray[index].kemungkinan ? newArray[index].kemungkinan : "0"), parseInt(newArray[index].dampak ? newArray[index].dampak : "0"));
    if (key === "kemungkinan" || key === "dampak")
      newArray[index] = { ...newArray[index], tingkatRisiko: riskrate };
    setListDataFaktor(newArray);
    if (value && listDataPenanganan.length === 0)
      addRowPenanganan();
  };

  const deleteRowFaktor = (index) => {
    let newArrayError = [...errorFaktor];
    newArrayError.splice(index, 1);
    setErrorFaktor(newArrayError);

    let newArray = [...listDataFaktor];
    newArray.splice(index, 1);
    setListDataFaktor(newArray);
  };

  const addRowPenanganan = () => {
    let newError = [...errorPenanganan];
    newError.push(defaultError);
    setErrorPenanganan(newError);

    let newArray = [...listDataPenanganan];
    newArray.push(defaultListPenanganan);
    setListDataPenanganan(newArray);
  };

  const handleChangePenanganan = (value, index, key) => {
    let newError = [...errorPenanganan];
    newError[index] = { ...newError[index], [key]: value ? noErr : err };
    setErrorPenanganan(newError);

    let newArray = [...listDataPenanganan];
    newArray[index] = { ...newArray[index], [key]: value };
    const riskrate = hitungTingkatRisiko(parseInt(newArray[index].kemungkinan ? newArray[index].kemungkinan : "0"), parseInt(newArray[index].dampak ? newArray[index].dampak : "0"));
    if (key === "kemungkinan" || key === "dampak")
      newArray[index] = { ...newArray[index], tingkatRisiko: riskrate };
    setListDataPenanganan(newArray);
  };

  const deleteRowPenanganan = (index) => {
    let newArrayError = [...errorPenanganan];
    newArrayError.splice(index, 1);
    setErrorPenanganan(newArrayError);

    let newArray = [...listDataPenanganan];
    newArray.splice(index, 1);
    setListDataPenanganan(newArray);
  };

  const disableIconDeleteFaktor = (data) => {
    return listDataPenanganan.some(d => d.faktor === data.deskripsi);
  };

  const hitungTingkatRisiko = (kemungkinan, dampak) => {
    const total = kemungkinan * dampak;
    if (0 <= total && total <= 5) return "Rendah";
    else if (6 <= total && total <= 12) return "Sedang";
    else if (13 <= total && total <= 30) return "Tinggi";
    else return "";
  };

  const validateAll = () => {
    let newErrorFaktor = errorFaktor.map((ef, i) => {
      let newObj = {
        deskripsi: listDataFaktor[i].deskripsi ? noErr : err,
        kemungkinan: listDataFaktor[i].kemungkinan ? noErr : err,
        dampak: listDataFaktor[i].dampak ? noErr : err
      };
      return newObj;
    });
    setErrorFaktor(newErrorFaktor);

    let newErrorPenanganan = errorPenanganan.map((ef, i) => {
      // console.log("data penanganan", listDataPenanganan[i]);
      let newObj = {
        faktor: listDataPenanganan[i].faktor ? noErr : err,
        deskripsi: listDataPenanganan[i].deskripsi ? noErr : err,
        kemungkinan: listDataPenanganan[i].kemungkinan ? noErr : err,
        dampak: listDataPenanganan[i].dampak ? noErr : err
      };
      return newObj;
    });
    setErrorPenanganan(newErrorPenanganan);

    if (listDataFaktor.every(df => df.deskripsi && df.kemungkinan && df.dampak) &&
      listDataPenanganan.every(dp => dp.faktor && dp.deskripsi && dp.kemungkinan && dp.dampak)) return true;
    else return false;
  };

  const simpan = () => {
    setLoadingButton(true);
    if (listDataFaktor.every(df => listDataPenanganan.some(dp => dp.faktor === df.deskripsi))) {
      if (validateAll()) {
        // const listdetail = data.map(dt => ({
        //   idplan: dt.idplan ? dt.idplan : null,
        //   kegiatan: dt.kegiatan,
        //   pelaksana: dt.pelaksana,
        //   tanggalMulai: dt.tanggalMulai,
        //   tanggalSelesai: dt.tanggalSelesai
        // }));
        // const formatData = {
        //   idproyek: proyek.IDPROYEK,
        //   listdetail: listdetail
        // };
        setTimeout(() => {
          console.log("simpan");
          console.log("proyek", proyek);
          setLoadingButton(false);
        }, 2000);
      } else {
        setAlertDialog({ openAlertDialog: true, messageAlertDialog: "Silahkan periksa data yang anda masukkan.", severity: "warning" });
        setLoadingButton(false);
      }
    } else {
      setAlertDialog({ openAlertDialog: true, messageAlertDialog: "Masing-masing Faktor harus memiliki minimal satu Penanganan. Silahkan periksa data yang anda masukkan.", severity: "warning" });
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
          {edit ? "Ubah Kajian Risiko" : "Tambah Kajian Risiko"}
        </Typography>
      </Grid>
      <Divider />
      <Grid item xs={6}>
        <TextField id="nomor"
          label="Nomor Risiko"
          fullWidth
          disabled
          className={classes.fieldDisabled}
          value={nomor}
        />
      </Grid>
      <Grid item>
        <Paper className={classes.paper}>
          <Grid container direction="column" spacing={2}>
            <Grid item container direction="row" justify="space-between">
              <Grid item xs>
                <Typography variant="h6">List Faktor</Typography>
              </Grid>
            </Grid>
            <Grid item container direction="column" spacing={1}>
              <Grid item container direction="row" spacing={1} justify="space-between">
                <Grid item xs>
                  <Typography align="center">Deskripsi</Typography>
                </Grid>
                <Grid item xs={2}>
                  <Typography align="center">Kemungkinan</Typography>
                </Grid>
                <Grid item xs={2}>
                  <Typography align="center">Dampak</Typography>
                </Grid>
                <Grid item xs={2}>
                  <Typography align="center">Tingkat Risiko</Typography>
                </Grid>
                <Grid item xs={1}>
                  <Typography align="center">Actions</Typography>
                </Grid>
              </Grid>
              {listDataFaktor && listDataFaktor.map((d, i) =>
                <Grid item key={"grid-cont-faktor-" + i} container direction="row" spacing={1} justify="space-between" alignItems="center">
                  <Grid key={"grid-deskripsi-faktor-" + i} item xs>
                    <TextField key={"deskripsi-faktor-" + i} id={"deskripsi-faktor-" + i} name={"deskripsi-faktor-" + i}
                      variant="outlined"
                      fullWidth
                      multiline
                      size="small"
                      value={d.deskripsi}
                      onChange={(event) => handleChangeFaktor(event.target.value, i, "deskripsi")}
                      required
                      error={errorFaktor[i].deskripsi.error}
                      helperText={errorFaktor[i].deskripsi.text}
                    />
                  </Grid>
                  <Grid key={"grid-likely-faktor-" + i} item xs={2}>
                    <TextField key={"likely-faktor-" + i} id={"likely-faktor-" + i} name={"likely-faktor-" + i}
                      variant="outlined"
                      fullWidth
                      select
                      size="small"
                      value={d.kemungkinan}
                      onChange={(event) => handleChangeFaktor(event.target.value, i, "kemungkinan")}
                      required
                      error={errorFaktor[i].kemungkinan.error}
                      helperText={errorFaktor[i].kemungkinan.text}
                    >
                      <MenuItem value="">
                        <em>Pilih</em>
                      </MenuItem>
                      {kemungkinan.map((d) => (
                        <MenuItem key={"menu-likely-faktor-" + d.value} value={d.value}>
                          {d.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid key={"grid-impact-faktor-" + i} item xs={2}>
                    <TextField key={"impact-faktor-" + i} id={"impact-faktor-" + i} name={"impact-faktor-" + i}
                      variant="outlined"
                      fullWidth
                      select
                      size="small"
                      value={d.dampak}
                      onChange={(event) => handleChangeFaktor(event.target.value, i, "dampak")}
                      required
                      error={errorFaktor[i].dampak.error}
                      helperText={errorFaktor[i].dampak.text}
                    >
                      <MenuItem value="">
                        <em>Pilih</em>
                      </MenuItem>
                      {dampak.map((d) => (
                        <MenuItem key={"menu-impact-faktor-" + d.value} value={d.value}>
                          {d.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid key={"grid-riskrate-faktor-" + i} item xs={2}>
                    <TextField key={"riskrate-faktor-" + i} id={"riskrate-faktor-" + i} name={"riskrate-faktor-" + i}
                      fullWidth
                      size="small"
                      value={d.tingkatRisiko}
                      disabled
                      className={classes.fieldDisabled}
                    />
                  </Grid>
                  <Grid key={"grid-action-faktor-" + i} item xs={1} container justify="center">
                    <IconButton key={"button-action-faktor-" + i} size="small" onClick={() => deleteRowFaktor(i)} disabled={disableIconDeleteFaktor(d)}>
                      <RemoveCircleOutline key={"icon-action-faktor-" + i} />
                    </IconButton>
                  </Grid>
                </Grid>
              )}
              <Grid item xs container justify="center">
                <Button fullWidth aria-label="add row faktor" size="small" onClick={addRowFaktor} >
                  <AddCircleOutline />
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
      <Grid item>
        <Paper className={classes.paper}>
          <Grid container direction="column" spacing={2}>
            <Grid item container direction="row" justify="space-between">
              <Grid item xs>
                <Typography variant="h6">List Penanganan</Typography>
              </Grid>
            </Grid>
            <Grid item container direction="column" spacing={1}>
              <Grid item container direction="row" spacing={1} justify="space-between">
                <Grid item xs>
                  <Typography align="center">Faktor</Typography>
                </Grid>
                <Grid item xs>
                  <Typography align="center">Deskripsi</Typography>
                </Grid>
                <Grid item xs={2}>
                  <Typography align="center">Kemungkinan</Typography>
                </Grid>
                <Grid item xs={2}>
                  <Typography align="center">Dampak</Typography>
                </Grid>
                <Grid item xs={2}>
                  <Typography align="center">Tingkat Risiko</Typography>
                </Grid>
                <Grid item xs={1}>
                  <Typography align="center">Actions</Typography>
                </Grid>
              </Grid>
              {listDataPenanganan && listDataPenanganan.map((d, i) =>
                <Grid item key={"grid-cont-penanganan-" + i} container direction="row" spacing={1} justify="space-between" alignItems="center">
                  <Grid key={"grid-factor-penanganan-" + i} item xs>
                    <TextField key={"factor-penanganan-" + i} id={"factor-penanganan-" + i} name={"factor-penanganan-" + i}
                      variant="outlined"
                      fullWidth
                      select
                      multiline
                      size="small"
                      value={d.faktor}
                      onChange={(event) => handleChangePenanganan(event.target.value, i, "faktor")}
                      required
                      error={errorPenanganan[i].faktor.error}
                      helperText={errorPenanganan[i].faktor.text}
                    >
                      <MenuItem value="">
                        <em>Pilih</em>
                      </MenuItem>
                      {listDataFaktor.map((d) => (
                        <MenuItem key={"menu-factor-penanganan-" + d.deskripsi} value={d.deskripsi}>
                          {d.deskripsi}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid key={"grid-deskripsi-penanganan-" + i} item xs>
                    <TextField key={"deskripsi-penanganan-" + i} id={"deskripsi-penanganan-" + i} name={"deskripsi-penanganan-" + i}
                      variant="outlined"
                      fullWidth
                      multiline
                      size="small"
                      value={d.deskripsi}
                      onChange={(event) => handleChangePenanganan(event.target.value, i, "deskripsi")}
                      required
                      error={errorPenanganan[i].deskripsi.error}
                      helperText={errorPenanganan[i].deskripsi.text}
                    />
                  </Grid>
                  <Grid key={"grid-likely-penanganan-" + i} item xs={2}>
                    <TextField key={"likely-penanganan-" + i} id={"likely-penanganan-" + i} name={"likely-penanganan-" + i}
                      variant="outlined"
                      fullWidth
                      select
                      size="small"
                      value={d.kemungkinan}
                      onChange={(event) => handleChangePenanganan(event.target.value, i, "kemungkinan")}
                      required
                      error={errorPenanganan[i].kemungkinan.error}
                      helperText={errorPenanganan[i].kemungkinan.text}
                    >
                      <MenuItem value="">
                        <em>Pilih</em>
                      </MenuItem>
                      {kemungkinan.map((d) => (
                        <MenuItem key={"menu-likely-penanganan-" + d.value} value={d.value}>
                          {d.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid key={"grid-impact-penanganan-" + i} item xs={2}>
                    <TextField key={"impact-penanganan-" + i} id={"impact-penanganan-" + i} name={"impact-penanganan-" + i}
                      variant="outlined"
                      fullWidth
                      select
                      size="small"
                      value={d.dampak}
                      onChange={(event) => handleChangePenanganan(event.target.value, i, "dampak")}
                      required
                      error={errorPenanganan[i].dampak.error}
                      helperText={errorPenanganan[i].dampak.text}
                    >
                      <MenuItem value="">
                        <em>Pilih</em>
                      </MenuItem>
                      {dampak.map((d) => (
                        <MenuItem key={"menu-impact-penanganan-" + d.value} value={d.value}>
                          {d.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid key={"grid-riskrate-penanganan-" + i} item xs={2}>
                    <TextField key={"riskrate-penanganan-" + i} id={"riskrate-penanganan-" + i} name={"riskrate-penanganan-" + i}
                      fullWidth
                      size="small"
                      value={d.tingkatRisiko}
                      disabled
                      className={classes.fieldDisabled}
                    />
                  </Grid>
                  <Grid key={"grid-action-penanganan-" + i} item xs={1} container justify="center">
                    <IconButton key={"button-action-penanganan-" + i} size="small" onClick={() => deleteRowPenanganan(i)}>
                      <RemoveCircleOutline key={"icon-action-penanganan-" + i} />
                    </IconButton>
                  </Grid>
                </Grid>
              )}
              <Grid item xs container justify="center">
                <Button fullWidth aria-label="add row penanganan" size="small" onClick={addRowPenanganan} >
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
}