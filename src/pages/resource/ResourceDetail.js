import React from 'react';
import { Grid, makeStyles, Typography, Divider, TextField, Paper, InputLabel, RadioGroup, FormControlLabel, Radio } from '@material-ui/core';

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

// const pilihServer = ["server yang sudah ada", "server dengan kebutuhan khusus"];

export default function ResourceDetail(props) {
  const { resource } = props;
  const classes = useStyles();

  return (
    <Grid container direction="column" spacing={2}>
      <Grid item>
        <Typography variant="h4" gutterBottom>
          {"Detail Kebutuhan Sumber Daya"}
        </Typography>
      </Grid>
      <Divider />
      <Grid item xs={6}>
        <TextField id="nomor"
          label="Nomor Kebutuhan Sumber Daya"
          fullWidth
          disabled
          className={classes.fieldDisabled}
          value={resource.NORES}
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
                  value={resource.LISTDETAIL.find(d => d.KODE === 'STORAGE')?.NAMARESOURCE || ""}
                  // onChange={(e) => handleChangeDataTambahan(e.target.value, 'STORAGE')}
                  style={{ marginLeft: '10px' }}
                  disabled
                />
              </Grid>
              <Grid item container direction='row' alignItems='center'>
                <Grid item xs={4}>
                  <InputLabel>Jumlah user</InputLabel>
                </Grid>
                <TextField variant='outlined'
                  size='small'
                  value={resource.LISTDETAIL.find(d => d.KODE === 'USER')?.NAMARESOURCE || ""}
                  // onChange={(e) => handleChangeDataTambahan(e.target.value, 'USER')}
                  style={{ marginLeft: '10px' }}
                  disabled
                />
              </Grid>
              <Grid item container direction='row' alignItems='center'>
                <Grid item xs={4}>
                  <InputLabel>Infrastruktur yang akan digunakan</InputLabel>
                </Grid>
                <Grid item xs>
                  <TextField variant='outlined'
                    size='small'
                    value={resource.LISTDETAIL.find(d => d.KODE === 'SERVER')?.NAMARESOURCE || ""}
                    // onChange={(e) => handleChangeDataTambahan(e.target.value, 'USER')}
                    style={{ marginLeft: '10px' }}
                    disabled
                  />
                  {/* <TextField
                    select
                    variant="outlined"
                    size='small'
                    value={[pilihServer[0], ""].includes(resource.LISTDETAIL.find(d => d.KODE === 'SERVER').NAMARESOURCE)
                      ? resource.LISTDETAIL.find(d => d.KODE === 'SERVER').NAMARESOURCE
                      : pilihServer[pilihServer.length - 1]}
                    // onChange={(e) => handleChangeDataTambahan(e.target.value, 'SERVER')}
                    style={{ marginLeft: '10px' }}
                    disabled
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
                  } */}
                </Grid>
              </Grid>
              <Grid item container direction='row' alignItems='center'>
                <Grid item xs={4}>
                  <InputLabel>Kebutuhan jaringan</InputLabel>
                </Grid>
                <RadioGroup row
                  value={resource.LISTDETAIL.find(d => d.KODE === 'NETWORK')?.NAMARESOURCE ? resource.LISTDETAIL.find(d => d.KODE === 'NETWORK')?.NAMARESOURCE : null}
                  // onChange={(e) => handleChangeDataTambahan(e.target.value, 'NETWORK')}
                  style={{ marginLeft: '10px' }}
                >
                  <FormControlLabel disabled value="internet" control={<Radio />} label="Internet" />
                  <FormControlLabel disabled value="intranet" control={<Radio />} label="Intranet" />
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
                  value={resource.LISTDETAIL.find(d => d.code === 'BACKUP')?.NAMARESOURCE || ""}
                  // onChange={(e) => handleChangeDataTambahan(e.target.value, 'BACKUP')}
                  style={{ marginLeft: '10px' }}
                  disabled
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
              </Grid>
              {resource && resource.LISTDETAIL.filter(f => !f.KODE).map((d, i) =>
                <Grid item key={"grid-cont-" + i} container direction="row" spacing={1} justifyContent="space-between" alignItems="center">
                  <Grid key={"grid-deskripsi-" + i} item xs>
                    <TextField key={"deskripsi-" + i} id={"deskripsi-" + i} name={"deskripsi-" + i}
                      fullWidth
                      multiline
                      size="small"
                      value={d.NAMARESOURCE}
                      disabled
                      className={classes.fieldDisabled}
                    />
                  </Grid>
                  <Grid key={"grid-satuan-" + i} item xs={3}>
                    <TextField key={"satuan-" + i} id={"satuan-" + i} name={"satuan-" + i}
                      fullWidth
                      multiline
                      size="small"
                      value={d.KODEUOM}
                      disabled
                      className={classes.fieldDisabled}
                    />
                  </Grid>
                  <Grid key={"grid-jumlah-" + i} item xs={2}>
                    <TextField key={"jumlah-" + i} id={"jumlah-" + i} name={"jumlah-" + i}
                      fullWidth
                      size="small"
                      value={d.QUANTITY}
                      disabled
                      className={classes.fieldDisabled}
                      inputProps={{ style: { textAlign: 'right' } }}
                    />
                  </Grid>
                </Grid>
              )}
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  );
}