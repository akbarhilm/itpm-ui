import React from 'react';
import { Grid, makeStyles, Paper, Typography } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
    margin: "auto",
    maxWidth: "100%",
  },
}));

export default function CharterDetail(props) {
  const { charter, proyek } = props;
  const classes = useStyles();
  // console.log(charter);

  return (
    <Grid container spacing={3} direction="column" >
      <Grid item xs>
        <Typography variant="h4" gutterBottom>
          {"Detail Charter"}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Paper className={classes.paper}>

          <Grid  >
            <Typography variant="h6">{"Nomor Charter : "}</Typography>
            <Typography style={{ marginLeft: 20 }} gutterBottom>{charter.NOCHARTER || "-"}</Typography>

            <Typography variant="h6">{"Nama Proyek : "}</Typography>
            <Typography style={{ marginLeft: 20 }} gutterBottom>{proyek.NAMAPROYEK || "-"}</Typography>

            <Typography variant="h6">{"NIK BPO : "}</Typography>
            <Typography style={{ marginLeft: 20 }} gutterBottom>{proyek.NIKREQ || "-"}</Typography>

            <Typography variant="h6">{"NIK PM : "}</Typography>
            <Typography style={{ marginLeft: 20 }} gutterBottom>{proyek.NIKPM || "-"}</Typography>

            <Typography variant="h6">{"Periode : "}</Typography>
            <Typography style={{ marginLeft: 20 }} gutterBottom>{(charter.TGLMULAI || "-") + " s/d " + (charter.TGLSELESAI || "-")}</Typography>

            <Typography variant="h6">{"Tujuan : "}</Typography>
            {(charter.TUJUAN && charter.TUJUAN.map((d, i) =>
              <Typography key={"tujuan-" + i} style={{ marginLeft: 20 }} gutterBottom>{i + ". " + d.KETERANGAN}</Typography>
            )) || <Typography style={{ marginLeft: 20 }} gutterBottom>{"-"}</Typography>}

            <Typography variant="h6">{"Ruang Lingkup : "}</Typography>
            {(charter.SCOPE && charter.SCOPE.map((d, i) =>
              <Typography key={"scope-" + i} style={{ marginLeft: 20 }} gutterBottom>{i + ". " + d.KETERANGAN}</Typography>
            )) || <Typography style={{ marginLeft: 20 }} gutterBottom>{"-"}</Typography>}

            <Typography variant="h6">{"Target / Hasil Capaian : "}</Typography>
            {(charter.TARGET && charter.TARGET.map((d, i) =>
              <Typography key={"target-" + i} style={{ marginLeft: 20 }} gutterBottom>{i + ". " + d.KETERANGAN}</Typography>
            )) || <Typography style={{ marginLeft: 20 }} gutterBottom>{"-"}</Typography>}

          </Grid>
        </Paper>
      </Grid>
    </Grid>
  );
};