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

export default function RencanaPelaksanaanDetail(props) {
  const { plan, kegiatan, karyawan } = props;
  const classes = useStyles();

  const [data, setData] = useState();

  useEffect(() => {
    const formatNewData = (listdetail) => {
      const grouped = groupBy(listdetail, x => x.IDKEGIATAN);
      const newData = [];
      grouped.forEach((value, key, map) => {
        const pelaksana = karyawan ? value.map(v => karyawan.filter(kar => kar.nik === v.NIKPELAKSANA).length > 0 ? karyawan.filter(kar => kar.nik === v.NIKPELAKSANA)[0].nik : v.NIKPELAKSANA) : [];
        const keg = kegiatan ? kegiatan.filter(keg => keg.id === key)[0] : null;
        //const role = roles? !!roles.find(e=>e.id === 0)?roles.find(el=>el.id === value[0].IDROLE):{id:value[0].IDROLE}:{id:value[0].IDROLE}
        newData.push({
          kegiatan: keg ? keg.kegiatan : "",
          pelaksana: pelaksana.toString(),
         // role:role,
          tanggalMulai: value[0].TGLMULAI, //moment(value[0].TGLMULAI, "DD/MM/YYYY"),
          tanggalSelesai: value[0].TGLSELESAI, //moment(value[0].TGLSELESAI, "DD/MM/YYYY"),
          target: keg ? keg.target : "",
        });
      });
      return newData;
    };
    const newData = formatNewData(plan.LISTDETAIL);
    setData(newData);
  }, [plan, kegiatan, karyawan]);

  return (
    <Grid container direction="column" spacing={2}>
      <Grid item>
        <Typography variant="h4" gutterBottom>
          {"Detail Rencana Pelaksanaan"}
        </Typography>
      </Grid>
      <Divider />
      <Grid item xs={6}>
        <TextField id="nomor"
          label="Nomor Rencana Pelaksanaan"
          fullWidth
          disabled
          className={classes.fieldDisabled}
          value={plan.NOPLAN}
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
              <Grid item container direction="row" spacing={3} justify="space-between">
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
                <Grid item xs={2}>
                  <Typography align="center" variant="body2"><b>Target</b></Typography>
                </Grid>
              </Grid>
              {data && data.map((d, i) =>
                <Grid item key={"grid-cont-" + i} container direction="row" spacing={3} justify="space-between" alignItems="center">
                  <Grid key={"grid-kegiatan-" + i} item xs>
                    <TextField key={"kegiatan-" + i} id={"kegiatan-" + i} name={"kegiatan-" + i}
                      multiline
                      fullWidth
                      size="small"
                      value={d.kegiatan}
                      disabled
                      className={classes.fieldTableDisabled}
                    />
                  </Grid>
                  <Grid key={"grid-pelaksana-" + i} item xs>
                    <TextField key={"pelaksana-" + i} id={"pelaksana-" + i} name={"pelaksana-" + i}
                      multiline
                      fullWidth
                      size="small"
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
                    <TextField key={"mulai-" + i} id={"mulai-" + i} name={"mulai-" + i}
                      multiline
                      fullWidth
                      size="small"
                      value={d.tanggalMulai}
                      disabled
                      className={classes.fieldTableDisabled}
                    />
                  </Grid>
                  <Grid key={"grid-selesai-" + i} item xs={2}>
                    <TextField key={"selesai-" + i} id={"selesai-" + i} name={"selesai-" + i}
                      multiline
                      fullWidth
                      size="small"
                      value={d.tanggalSelesai}
                      disabled
                      className={classes.fieldTableDisabled}
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