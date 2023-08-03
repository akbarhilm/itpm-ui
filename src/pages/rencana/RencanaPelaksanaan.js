import React, { useState, useEffect, useCallback } from 'react';
import { Grid, Typography, Button, TextField, makeStyles, Paper, IconButton, Checkbox, Divider, CircularProgress } from '@material-ui/core';
import AlertDialog from '../../components/AlertDialog';
import { AddCircleOutline, RemoveCircleOutline, CheckBoxOutlineBlank, CheckBox } from '@material-ui/icons';
import { KeyboardDatePicker } from '@material-ui/pickers';
import { Autocomplete } from '@material-ui/lab';
import moment from 'moment';
import { createRencanaPelaksanaan, updateRencanaPelaksanaan } from '../../gateways/api/PlanAPI';
import { groupBy } from '../../utils/Common';

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

const defaultData = { kegiatan: null, pelaksana: [],role:null, tanggalMulai: null, tanggalSelesai: null, target: "", disabled: false };

const err = { error: true, text: "Tidak boleh kosong." };
const noErr = { error: false, text: "" };
const defaultError = { kegiatan: noErr, pelaksana: noErr, tanggalMulai: noErr, tanggalSelesai: noErr,role:noErr };

export default function RencanaPelaksanaan(props) {
  const { plan, proyek, kegiatan, karyawan, minDate,roles } = props;
  const classes = useStyles();

  const [loadingButton, setLoadingButton] = useState(false);
  const [edit, setEdit] = useState(false);
  const [nomor, setNomor] = useState("");
  const [data, setData] = useState();
  const [error, setError] = useState();
  const [listKegiatan, setListKegiatan] = useState();
  const [listrole,setListrole] = useState();
  const [listKaryawan, setListKaryawan] = useState();
  const [alertDialog, setAlertDialog] = useState(defaultAlert);

  const handleCloseAlertDialog = () => {
    setAlertDialog({ ...alertDialog, openAlertDialog: false });
  };

  const formatNewData = useCallback((listdetail) => {
    const grouped = groupBy(listdetail, x => x.IDKEGIATAN);
    const newData = [];
    //console.log(grouped)
    grouped.forEach((value, key, map) => {
      const pelaksana = listKaryawan ? value.map(v => listKaryawan.filter(kar => kar.nik === v.NIKPELAKSANA)[0] || ({ nik: v.NIKPELAKSANA })) : [];
      const kegiatan = listKegiatan ? listKegiatan.filter(keg => keg.id === key)[0] : null;
      const role = listrole? !!listrole.find(e=>e.id === value[0].IDROLE)?listrole.find(el=>el.id === value[0].IDROLE):{id:value[0].IDROLE}:{id:value[0].IDROLE}
      
      
      newData.push({
        kegiatan: kegiatan,
        pelaksana: pelaksana,
        role : role,
        tanggalMulai: moment(value[0].TGLMULAI, "DD/MM/YYYY"),
        tanggalSelesai: moment(value[0].TGLSELESAI, "DD/MM/YYYY"),
        target: kegiatan ? kegiatan.target : "",
        disabled: role.id==="0"?true:value[0].REALISASI
      });
    });
    if (listKaryawan && listKegiatan)
      newData.sort((a, b) => a.kegiatan.id - b.kegiatan.id);
      console.log(newData)
    return newData;
  }, [listKaryawan, listKegiatan,listrole]);

  useEffect(() => {
    if (Object.keys(plan).length > 0) {
      const newData = formatNewData(plan.LISTDETAIL);
      setEdit(true);
      setNomor(plan.NOPLAN);
      setData(newData);
      setError(newData.map(d => defaultError));
    } else {
      setData([defaultData]);
      setError([defaultError]);
    }
    
  }, [plan, formatNewData]);

  useEffect(() => {
    if (!listKegiatan) {
      setListKegiatan(kegiatan);
    }
  }, [listKegiatan, kegiatan]);

  useEffect(() => {
    if (!listrole) {
      setListrole(roles);
    }
  }, [listrole, roles]);

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
    } else if (key === "pelaksana") {
      newArray[index] = { ...newArray[index],[key]: value,role:null};
    } else {
      newArray[index] = { ...newArray[index], [key]: value };
    }
    setData(newArray);
  };

  const addRow = () => {
    let newArrayError = [...error];
    newArrayError.push(defaultError);
    setError(newArrayError);

    let newArray = [...data];
    newArray.map(el=>Object.values(el.role)[0]==="0"? true : false).some(x=>x===true)?defaultData.disablerole=true:defaultData.disablerole=false
    console.log(defaultData)
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
          kegiatan: data[i].kegiatan ? noErr : err,
          pelaksana: data[i].pelaksana.length > 0 ? noErr : err,
          role: data[i].role ? noErr : err,
          tanggalMulai: data[i].tanggalMulai ? noErr : err,
          tanggalSelesai: data[i].tanggalSelesai ? noErr : err
        };
        return newObj;
      })
    );
    if (data.every(dt => dt.kegiatan && dt.role && dt.pelaksana.length > 0 && dt.tanggalMulai && dt.tanggalSelesai)) return true;
    else return false;
  };

  const simpan = () => {
    setLoadingButton(true);
    if (data.length > 0) {
      if (validateAll()) {
        const listdetail = data.map(dt => ({
          idkegiatan: dt.kegiatan.id,
          progress:0,
          idrole : dt.role.id,
          pelaksana: dt.pelaksana.map(pel => pel.nik),
          tglmulai: moment(dt.tanggalMulai).format("DD/MM/YYYY"),
          tglselesai: moment(dt.tanggalSelesai).format("DD/MM/YYYY")
        }));
        const formatData = {
          idproj: proyek.IDPROYEK,
          listdetail: listdetail
        };
       
        if (edit) {
         
          updateRencanaPelaksanaan(formatData)
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
          createRencanaPelaksanaan(formatData)
            .then((response) => {
              setData(formatNewData(response.data.LISTDETAIL));
              setNomor(response.data.NOPLAN);
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
          {edit ? "Ubah Rencana Pelaksanaan" : "Tambah Rencana Pelaksanaan"}
        </Typography>
      </Grid>
      <Divider />
      <Grid item xs={6}>
        <TextField id="nomor"
          label="Nomor Rencana Pelaksanaan"
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
            </Grid>
            <Grid item container direction="column" spacing={1}>
              <Grid item container direction="row" spacing={1} justify="space-between">
                <Grid item xs>
                  <Typography align="center" variant="body2"><b>Kegiatan</b></Typography>
                </Grid>
                <Grid item xs>
                  <Typography align="center" variant="body2"><b>Pelaksana</b></Typography>
                </Grid>
                <Grid item xs>
                  <Typography align="center" variant="body2"><b>Role</b></Typography>
                </Grid>
                <Grid item xs={2}>
                  <Typography align="center" variant="body2"><b>Tanggal Mulai</b></Typography>
                </Grid>
                <Grid item xs={2}>
                  <Typography align="center" variant="body2"><b>Tanggal Selesai</b></Typography>
                </Grid>
                <Grid item xs={2}>
                  <Typography align="center" variant="body2"><b>Target</b></Typography>
                </Grid>
                <Grid item xs={1}>
                  <Typography align="center" variant="body2"><b>Actions</b></Typography>
                </Grid>
              </Grid>
              {data && data.map((d, i) =>
                <Grid item key={"grid-cont-" + i} container direction="row" spacing={1} justify="space-between" alignItems="flex-start">
                  <Grid key={"grid-kegiatan-" + i} item xs>
                    <Autocomplete key={"kegiatan-" + i} id={"kegiatan-" + i} name={"kegiatan-" + i}
                      options={listKegiatan || []}
                      getOptionLabel={option => option.kegiatan+' / '+option.bobot+'%'}
                      onChange={(e, v) => handleChange(v, i, "kegiatan")}
                      value={d.kegiatan}
                      getOptionSelected={
                        (option, value) => option.id === value.id
                      }
                      renderOption={(option) => (
                        <React.Fragment>
                          {option.kegiatan} / {option.bobot}%
                        </React.Fragment>
                      )}
                      renderInput={params => (
                        <TextField
                          {...params}
                          fullWidth
                          variant={d.disabled ? "standard" : "outlined"}
                          size="small"
                          error={error[i].kegiatan.error}
                          helperText={error[i].kegiatan.text}
                          className={d.disabled ? classes.fieldDisabled : null}
                        />
                      )}
                      disabled={d.disabled}
                    />
                  </Grid>
                  <Grid key={"grid-pelaksana-" + i} item xs>
                    {d.disabled ?
                      <TextField key={"pelaksana-" + i} id={"pelaksana-" + i} name={"pelaksana-" + i}
                        multiline
                        fullWidth
                        size="small"
                        value={d.pelaksana.map(d => d.nik)}
                        disabled
                        className={classes.fieldTableDisabled}
                      />
                      : <Autocomplete key={"pelaksana-" + i} id={"pelaksana-" + i} name={"pelaksana-" + i}
                    
                        multiple
                        disableCloseOnSelect
                        options={listKaryawan || []}
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
                            variant={d.disabled ? "standard" : "outlined"}
                            size="small"
                            error={error[i].pelaksana.error}
                            helperText={error[i].pelaksana.text}
                          />
                        )}
                        disabled={d.disabled}
                      />}
                  </Grid>
                  <Grid key={"grid-role-" + i} item xs>
                    <Autocomplete key={"role-" + i} id={"role-" + i} name={"role-" + i}
                   
                      options={listrole || []}
                      getOptionLabel={option =>option.kode?option.kode:option.id ==="0"?"N/A":option.id}
                      getOptionDisabled={option=>data[i].pelaksana.find(el=>el.nik === proyek.NIKPM)?null:option.id==='2'}
                      onChange={(e, v) => handleChange(v, i, "role")}
                      value={d.role}
                      getOptionSelected={
                        (option, value) => option.id === value.id
                      }
                      renderOption={(option) => (
                        <React.Fragment>
                          {option.kode} 
                        </React.Fragment>
                      )}
                      renderInput={params => (
                        <TextField
                          {...params}
                          fullWidth
                          variant={d.disabled ? "standard" : "outlined"}
                          size="small"
                          error={error[i].role.error}
                          helperText={error[i].role.text}
                          className={d.disabled ? classes.fieldDisabled : null}
                        />
                      )}
                      disabled={d.disabled||d.disablerole}
                    />
                  </Grid>
                  <Grid key={"grid-mulai-" + i} item xs={2}>
                    <KeyboardDatePicker key={"mulai-" + i} id={"mulai-" + i} name={"mulai-" + i}
                      fullWidth
                      clearable
                      format="DD/MM/YYYY"
                      size="small"
                      value={d.tanggalMulai}
                      minDate={minDate ? moment(minDate, "DD/MM/YYYY") : moment("1900-01-01", "YYYY-MM-DD")}
                      onChange={(value) => handleChange(value, i, "tanggalMulai")}
                      error={error[i].tanggalMulai.error}
                      helperText={error[i].tanggalMulai.text}
                      inputVariant={d.disabled ? "standard" : "outlined"}
                      views={['year', 'month', 'date']}
                      disabled={d.disabled}
                      className={d.disabled ? classes.fieldDisabled : null}
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
                      inputVariant={d.disabled ? "standard" : "outlined"}
                      views={['year', 'month', 'date']}
                      disabled={d.disabled || !d.tanggalMulai}
                      className={d.disabled ? classes.fieldDisabled : null}
                    />
                  </Grid>
                  <Grid key={"grid-target-" + i} item xs={2}>
                    <TextField key={"target-" + i} id={"target-" + i} name={"target-" + i}
                      multiline
                      fullWidth
                      size="small"
                      value={d.target}
                      disabled
                      className={classes.fieldTableDisabled}
                    />
                  </Grid>
                  <Grid item xs={1} container justify="center">
                    <IconButton size="small" onClick={() => deleteRow(i)} disabled={d.disabled}>
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
      <Divider />
      <Grid item container direction="row" justify="flex-end">
        <Button onClick={loadingButton ? null : simpan} variant="contained" color="primary">
          {loadingButton ? <CircularProgress size={20} color="inherit" /> : edit ? "Ubah" : "Simpan"}
        </Button>
      </Grid>
    </Grid>
  );
};