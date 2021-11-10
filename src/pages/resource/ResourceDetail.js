import React from 'react';
import { Grid, makeStyles, Typography, Divider, TextField, Paper } from '@material-ui/core';

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
            <Grid item container direction="row" justify="space-between">
              <Grid item xs>
                <Typography variant="h6">Sumber Daya Lain</Typography>
              </Grid>
            </Grid>
            <Grid item container direction="column" spacing={1}>
              <Grid item container direction="row" spacing={1} justify="space-between">
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
              {resource && resource.LISTDETAIL.map((d, i) =>
                <Grid item key={"grid-cont-" + i} container direction="row" spacing={1} justify="space-between" alignItems="center">
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