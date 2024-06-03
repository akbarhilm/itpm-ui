import React from 'react';
import { Grid, makeStyles, Typography, TextField, FormControl, FormLabel, Divider } from '@material-ui/core';
import PropTypes from 'prop-types';


function ListDetail(props) {
  const { label, data, classes } = props;

  return (
    <FormControl component="fieldset" fullWidth style={{ marginBottom: 10 }}>
      <FormLabel component="legend">{label}</FormLabel>
      <Grid container direction="column" justify="flex-start" >
        {data.map((d, i) =>
          <Grid item key={"grid-" + i}>
            <TextField key={"field-" + i} id={i.toString()} name={i.toString()} fullWidth
              multiline
              value={d.KETERANGAN}
              disabled
              className={classes.textFieldDisabled}
            />
          </Grid>
        )}
      </Grid>
    </FormControl>
  );
}

ListDetail.propTypes = {
  label: PropTypes.string,
  data: PropTypes.array.isRequired
};

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
    margin: "auto",
    maxWidth: "100%",
  },
  textFieldDisabled: {
    margin: "6px 0px 6px 0px",
    "& .MuiInputBase-root.Mui-disabled": {
      color: "rgba(0, 0, 0, 1)" // (default alpha is 0.38)
    }
  },
}));

export default function CharterDetail(props) {
  const { charter, proyek, approval } = props;
  const classes = useStyles();

 

  return (
    <Grid container spacing={3} direction="column" >
      {!approval && <Grid item xs>
        <Typography variant="h4" gutterBottom>
          {"Detail Charter"}
        </Typography>
      </Grid>}
      {!approval && <Divider />}
      <Grid item xs container spacing={2} direction="column">
        <Grid item xs container direction="row" spacing={2} justify="space-between">
          <Grid item xs={6}>
            <TextField id="nomor" label="Nomor Charter" fullWidth
              value={charter.NOCHARTER || "-"}
              disabled
              className={classes.textFieldDisabled}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField id="namaProyek" label="Nama Proyek" fullWidth
              value={proyek.NAMAPROYEK || "-"}
              disabled
              className={classes.textFieldDisabled}
            />
          </Grid>
        </Grid>
        <Grid item xs container direction="row" spacing={2} justify="space-between">
          <Grid item xs={6}>
            <TextField id="nikBPO" label="NIK BPO" fullWidth
              value={proyek.NIKREQ || "-"}
              disabled
              className={classes.textFieldDisabled}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField id="nikPM" label="NIK PM" fullWidth
              value={proyek.NIKPM || "-"}
              disabled
              className={classes.textFieldDisabled}
            />
          </Grid>
        </Grid>
        <Grid item xs container direction="row" spacing={2} justify="space-between">
          <Grid item xs={6}>
            <TextField id="tglMulai" label="Tanggal Mulai" fullWidth
              value={charter.TGLMULAI || "-"}
              disabled
              className={classes.textFieldDisabled}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField id="tglSelesai" label="Tanggal Selesai" fullWidth
              value={charter.TGLSELESAI || "-"}
              disabled
              className={classes.textFieldDisabled}
            />
          </Grid>
        </Grid>
        <Grid item xs container direction="row" spacing={2} justify="space-between" >
          <Grid item xs>
            <TextField id="non-financial" label="Benefit (Non-Financial)" fullWidth
              value={charter.BENEFITNONFINANSIAL || "-"}
              disabled
              className={classes.textFieldDisabled}
            />
          </Grid>
          <Grid item xs >
            <TextField id="financial" label="Benefit (Financial)" fullWidth
              value={charter.BENEFITFINANSIAL || "-"}
              disabled
              className={classes.textFieldDisabled}
            />
          </Grid>
        </Grid>
        <Grid item xs container spacing={2}>
          <Grid item xs>
            <ListDetail label="Tujuan" classes={classes} data={charter.TUJUAN} />
          </Grid>
        </Grid>
        <Grid item xs container spacing={2}>
          <Grid item xs>
            <ListDetail label="Ruang Lingkup" classes={classes} data={charter.SCOPE} />
          </Grid>
        </Grid>
        <Grid item xs container spacing={2}>
          <Grid item xs>
            <ListDetail label="Target / Hasil Capaian" classes={classes} data={charter.TARGET} />
          </Grid>
        </Grid>
      </Grid>
     
    </Grid>
  );
};