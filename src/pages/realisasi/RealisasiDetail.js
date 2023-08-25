import React, { useState, useEffect } from 'react';
import { Grid, Typography, Divider, TextField, makeStyles, Paper } from '@material-ui/core';
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

export default function RealisasiDetail(props) {
  const { realisasi, karyawan, kegiatan, plan } = props;
  const classes = useStyles();

  const [data, setData] = useState();

  useEffect(() => {
    const formatNewData = (listdetail) => {
      // menggabungkan data rencana dan realisasi menjadi 1 object
      // if (Object.keys(plan).length > 0) {
      const groupedRencana = groupBy(plan.LISTDETAIL, x => x.IDKEGIATAN);
      const newlist = [];
      groupedRencana.forEach((value, key, map) => {
       // const role = roles? !!roles.find(e=>e.id === 0)?roles.find(el=>el.id === value[0].IDROLE):{id:value[0].IDROLE}:{id:value[0].IDROLE}
        newlist.push({
          idkegiatan: key,
          kegiatan: kegiatan.length > 0 ? kegiatan.filter(k => k.IDKEGIATAN === key)[0].NAMAKEGIATAN : "",
          pelaksana: listdetail.filter(l => l.IDKEGIATAN === key).length > 0 ?
            listdetail.filter(l => l.IDKEGIATAN === key)
              .map(r => karyawan.filter(kar => kar.nik === r.NIKPELAKSANA).length > 0 ? karyawan.filter(kar => kar.nik === r.NIKPELAKSANA)[0].nik : r.NIKPELAKSANA)
              .toString()
            : "",
           // role:role,
          tanggalMulai: listdetail.filter(l => l.IDKEGIATAN === key).length > 0 ? listdetail.filter(l => l.IDKEGIATAN === key)[0].TGLMULAI : "",
          tanggalSelesai: listdetail.filter(l => l.IDKEGIATAN === key).length > 0 ? listdetail.filter(l => l.IDKEGIATAN === key)[0].TGLSELESAI : "",
          // disabled: listdetail.filter(l => l.IDKEGIATAN === key).length > 0 ? true : false,
          // checked: listdetail.filter(l => l.IDKEGIATAN === key).length > 0 ? true : false,
          progress:listdetail.filter(l=>l.IDKEGIATAN===key).length>0?listdetail.find(l=>l.IDKEGIATAN===key).PROGRESS:""
        });
      });
      newlist.sort((a, b) => a.idkegiatan - b.idkegiatan); // sorting by idkegiatan asc
      return newlist;
      // } else {
      //   return [];
      // }
    };
    // if (Object.keys(plan).length > 0) {
    //   if (Object.keys(realisasi).length > 0 && realisasi.NOREAL) {
    //     setEdit(true);
    //     setNomor(realisasi.NOREAL);
    //   }
    const newData = formatNewData(realisasi.LISTDETAIL || []);

    // set minimum date dari data plan, bukan dari data hasil gabungan plan dan realisasi
    // setMinimumDate(newData.map(x => moment(plan.LISTDETAIL.filter(p => x.idkegiatan === p.IDKEGIATAN)[0].TGLMULAI, "DD/MM/YYYY")));

    // set data realisasi yang sudah diinput sebagai data yang akan diubah
    // setDataSave(newData.filter(x => x.disabled));

    // set data awal, gabungan dari plan dan real
    setData(newData);
    // setError(newData.map(x => defaultError));
    // } else {
    //   setData([defaultData]);
    //   setError([defaultError]);
    // }
  }, [realisasi, plan, kegiatan, karyawan]);

  return (
    <Grid container direction="column" spacing={2}>
      <Grid item>
        <Typography variant="h4" gutterBottom>
          {"Detail Realisasi"}
        </Typography>
      </Grid>
      <Divider />
      <Grid item xs={6}>
        <TextField id="nomor"
          label="Nomor Realisasi"
          fullWidth
          disabled
          className={classes.fieldDisabled}
          value={realisasi.NOREAL}
        />
      </Grid>
      <Grid item >
        <Paper className={classes.paper}>
          <Grid container direction="column" spacing={2}>
            <Grid item container direction="row" justify="space-between">
              <Grid item xs>
                <Typography variant="h6">Data Realisasi</Typography>
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
                {/* <Grid item xs>
                  <Typography align="center" variant="body2"><b>Role</b></Typography>
                </Grid> */}
                <Grid item xs={2}>
                  <Typography align="center" variant="body2"><b>Tanggal Mulai</b></Typography>
                </Grid>
                <Grid item xs={2}>
                  <Typography align="center" variant="body2"><b>Tanggal Selesai</b></Typography>
                </Grid>
                <Grid item xs={1}>
                  <Typography align="center" variant="body2"><b>Progress</b></Typography>
                </Grid>
              </Grid>
              {data && data.map((d, i) =>
                <Grid item key={"grid-cont-" + i} container direction="row" spacing={1} justify="space-between" alignItems="flex-start">
                  <Grid key={"grid-kegiatan-" + i} item xs>
                    <TextField key={"kegiatan-" + i} id={"kegiatan-" + i} name={"kegiatan-" + i}
                      fullWidth
                      size="small"
                      multiline
                      value={d.kegiatan ? d.kegiatan : ""}
                      disabled
                      className={classes.fieldTableDisabled}
                    />
                  </Grid>
                  <Grid key={"grid-pelaksana-" + i} item xs>
                    {/* <Autocomplete key={"pelaksana-" + i} id={"pelaksana-" + i} name={"pelaksana-" + i}
                      multiple
                      disableCloseOnSelect
                      options={listKaryawan}
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
                          variant="outlined"
                          size="small"
                          error={error[i].pelaksana.error}
                          helperText={error[i].pelaksana.text}
                        />
                      )}
                    /> */}
                    <TextField key={"pelaksana-" + i} id={"pelaksana-" + i} name={"pelaksana-" + i}
                      fullWidth
                      size="small"
                      multiline
                      value={d.pelaksana}
                      disabled
                      className={classes.fieldTableDisabled}
                    />
                  </Grid>
                  {/* <Grid key={"grid-role-" + i} item xs>
                    <TextField key={"role-" + i} id={"role-" + i} name={"role-" + i}
                      multiline
                      fullWidth
                      size="small"
                      value={d.role.id==="0"?"N/A":d.role.kode}
                      disabled
                      className={classes.fieldTableDisabled}
                    />
                  </Grid> */}
                  <Grid key={"grid-mulai-" + i} item xs={2}>
                    {/* <KeyboardDatePicker key={"mulai-" + i} id={"mulai-" + i} name={"mulai-" + i}
                      fullWidth
                      clearable
                      format="DD/MM/YYYY"
                      size="small"
                      value={d.tanggalMulai}
                      minDate={minimumDate[i] || moment("1900-01-01", "YYYY-MM-DD")}
                      onChange={(value) => handleChange(value, i, "tanggalMulai")}
                      error={error[i].tanggalMulai.error}
                      helperText={error[i].tanggalMulai.text}
                      inputVariant={"outlined"}
                      views={['year', 'month', 'date']}
                    /> */}
                    <TextField key={"mulai-" + i} id={"mulai-" + i} name={"mulai-" + i}
                      fullWidth
                      size="small"
                      multiline
                      value={d.tanggalMulai}
                      disabled
                      className={classes.fieldTableDisabled}
                    />
                  </Grid>
                  <Grid key={"grid-selesai-" + i} item xs={2}>
                    {/* <KeyboardDatePicker key={"selesai-" + i} id={"selesai-" + i} name={"selesai-" + i}
                      fullWidth
                      clearable
                      format="DD/MM/YYYY"
                      size="small"
                      value={d.tanggalSelesai}
                      minDate={d.tanggalMulai || moment("1900-01-01", "YYYY-MM-DD")}
                      onChange={(value) => handleChange(value, i, "tanggalSelesai")}
                      error={error[i].tanggalSelesai.error}
                      helperText={error[i].tanggalSelesai.text}
                      inputVariant={"outlined"}
                      views={['year', 'month', 'date']}
                      disabled={!d.tanggalMulai}
                      className={!d.tanggalMulai ? classes.fieldDisabled : null}
                    /> */}
                    <TextField key={"selesai-" + i} id={"selesai-" + i} name={"selesai-" + i}
                      fullWidth
                      size="small"
                      multiline
                      value={d.tanggalSelesai}
                      disabled
                      className={classes.fieldTableDisabled}
                    />
                  </Grid>
                  <Grid key={"grid-progres-" + i} item xs={1} container justify="center">
                  <TextField key={"progres-" + i} id={"progres-" + i} name={"progres-" + i}
                      fullWidth
                      size="small"
                      multiline
                      value={d.progress==="0"?"N/A":d.progress}
                      disabled
                      className={classes.fieldTableDisabled}
                    />
                    {/* <Checkbox key={"check-" + i} disabled={d.disabled} checked={d.checked} onChange={(e) => onCheck(e.target.checked, i, d)} /> */}
                  </Grid>
                  {/* <Grid key={"grid-check-" + i} item xs={1} container justify="center">
                    <Checkbox key={"check-" + i} disabled={d.disabled} checked={d.checked} onChange={(e) => onCheck(e.target.checked, i, d)} />
                  </Grid> */}
                </Grid>
              )}
            </Grid>
          </Grid>
        </Paper>

      </Grid>
      <Divider />
      {/* <Grid item container direction="row" justify="flex-end">
        <Button onClick={loadingButton ? null : simpan} variant="contained" color="primary">
          {loadingButton ? <CircularProgress size={20} color="inherit" /> : edit ? "Ubah" : "Simpan"}
        </Button>
      </Grid> */}
    </Grid>
  );
}