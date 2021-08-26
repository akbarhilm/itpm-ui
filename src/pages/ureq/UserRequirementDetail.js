import React from 'react';
import { Grid, Typography, Divider, TextField, makeStyles, Paper } from '@material-ui/core';

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

export default function UserRequirementDetail(props) {
  const { ureq } = props;
  const classes = useStyles();

  return (
    <Grid container direction="column" spacing={2}>
      <Grid item>
        <Typography variant="h4" gutterBottom>
          {"Detail Kebutuhan Pengguna"}
        </Typography>
      </Grid>
      <Divider />
      <Grid item xs={6}>
        <TextField id="nomor"
          label="Nomor Kebutuhan Pengguna"
          fullWidth
          disabled
          className={classes.fieldDisabled}
          value={ureq.NOUREQ || ""}
        />
      </Grid>
      <Grid item >
        <Paper className={classes.paper}>
          <Grid container direction="column" spacing={2}>
            <Grid item container direction="row" justify="space-between">
              <Grid item xs>
                <Typography variant="h6">Data Requirement</Typography>
              </Grid>
            </Grid>
            <Grid item container direction="column" spacing={1}>
              <Grid item container direction="row" spacing={3} justify="space-between">
                <Grid item xs>
                  <Typography align="center" variant="body2"><b>Kebutuhan Sistem</b></Typography>
                </Grid>
                <Grid item xs={5}>
                  <Typography align="center" variant="body2"><b>Rincian Kebutuhan</b></Typography>
                </Grid>
                <Grid item xs={2}>
                  <Typography align="center" variant="body2"><b>Use Case</b></Typography>
                </Grid>
              </Grid>
              {/* <Divider /> */}
              {ureq && ureq.LISTDETAIL.map((d, i) =>
                <Grid item key={"grid-cont-" + i} container direction="row" spacing={3} justify="space-between" alignItems="center">
                  <Grid key={"grid-kebutuhan-" + i} item xs>
                    <TextField key={"kebutuhan-" + i} id={"kebutuhan-" + i} name={"kebutuhan-" + i}
                      fullWidth
                      multiline
                      size="small"
                      value={d.NAMAUREQ}
                      disabled
                      className={classes.fieldDisabled}
                    />
                  </Grid>
                  <Grid key={"grid-rincian-" + i} item xs={5}>
                    <TextField key={"rincian-" + i} id={"rincian-" + i} name={"rincian-" + i}
                      fullWidth
                      multiline
                      size="small"
                      value={d.KETUREQ}
                      disabled
                      className={classes.fieldDisabled}
                    />
                  </Grid>
                  <Grid key={"grid-use-case-" + i} item xs={2}>
                    <TextField key={"use-case-" + i} id={"use-case-" + i} name={"use-case-" + i}
                      fullWidth
                      size="small"
                      value={d.USECASE}
                      disabled
                      className={classes.fieldDisabled}
                    />
                  </Grid>
                </Grid>
              )}
            </Grid>
          </Grid>
        </Paper>
      </Grid>
      <Divider />
    </Grid>
  );
}