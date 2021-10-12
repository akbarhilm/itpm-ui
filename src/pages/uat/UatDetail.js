import React, { useContext } from 'react';
import { Divider, Grid, makeStyles, Paper, TextField, Typography } from '@material-ui/core';
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

export default function UatDetail(props) {
  const { approval, uat } = props;
  const { karyawan } = useContext(UserContext);
  const classes = useStyles();

  return (
    <Grid container direction="column" spacing={2}>
      {!approval && <Grid item>
        <Typography variant="h4" gutterBottom>
          {"Detail UAT (User Acceptence Test)"}
        </Typography>
      </Grid>}
      {!approval && <Divider />}
      <Grid item xs={6}>
        <TextField id="nomor"
          label="Nomor UAT"
          fullWidth
          disabled
          className={classes.fieldDisabled}
          value={uat.NOUAT}
        />
      </Grid>
      <Grid item >
        <Tabel label="System Analyst / Tim Fungsional"
          data={uat.LISTDETAIL
            .filter(d => d.KODEUAT === "1")
            .map(x => ({
              nik: x.NIKUAT,
              nama: karyawan.filter(z => z.nik === x.NIKUAT).length > 0
                ? karyawan.filter(z => z.nik === x.NIKUAT)[0].nama : "",
              org: karyawan.filter(z => z.nik === x.NIKUAT).length > 0
                ? karyawan.filter(z => z.nik === x.NIKUAT)[0].organisasi + " / " + karyawan.filter(z => z.nik === x.NIKUAT)[0].nama_organisasi : ""
            }))
          }
        />
      </Grid>
      <Grid item >
        <Tabel label="User"
          data={uat.LISTDETAIL
            .filter(d => d.KODEUAT === "2")
            .map(x => ({
              nik: x.NIKUAT,
              nama: karyawan.filter(z => z.nik === x.NIKUAT).length > 0
                ? karyawan.filter(z => z.nik === x.NIKUAT)[0].nama : "",
              org: karyawan.filter(z => z.nik === x.NIKUAT).length > 0
                ? karyawan.filter(z => z.nik === x.NIKUAT)[0].organisasi + " / " + karyawan.filter(z => z.nik === x.NIKUAT)[0].nama_organisasi : ""
            }))
          }
        />
      </Grid>
      <Grid item >
        <Tabel label="Quality Control"
          data={uat.LISTDETAIL
            .filter(d => d.KODEUAT === "3")
            .map(x => ({
              nik: x.NIKUAT,
              nama: karyawan.filter(z => z.nik === x.NIKUAT).length > 0
                ? karyawan.filter(z => z.nik === x.NIKUAT)[0].nama : "",
              org: karyawan.filter(z => z.nik === x.NIKUAT).length > 0
                ? karyawan.filter(z => z.nik === x.NIKUAT)[0].organisasi + " / " + karyawan.filter(z => z.nik === x.NIKUAT)[0].nama_organisasi : ""
            }))
          }
        />
      </Grid>
      {!approval && <Divider />}
    </Grid>
  );
}

function Tabel(props) {
  const { label, data } = props;
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
          {/* <Grid item xs={1}>
            <Typography align="center" variant="body2"><b>Actions</b></Typography>
          </Grid> */}
        </Grid>
        {data && data.map((d, i) =>
          <Grid item key={"grid-cont-" + i} container direction="row" spacing={2} justify="space-between" alignItems="center">
            <Grid key={"grid-nik-" + i} item xs={2}>
              <TextField key={"nik-" + i} id={"nik-" + i} name={"nik-" + i}
                fullWidth
                multiline
                size="small"
                value={d.nik}
                disabled
                className={classes.fieldDisabled}
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
          </Grid>
        )}
      </Grid>
    </Grid>
  </Paper>;
}