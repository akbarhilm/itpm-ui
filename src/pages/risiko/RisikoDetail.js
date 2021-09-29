import React from 'react';
import { Grid, Typography, Divider, TextField, makeStyles, Paper } from '@material-ui/core';
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

export default function RisikoDetail(props) {
  const { risiko } = props;
  const classes = useStyles();

  const hitungTingkatRisiko = (kemungkinan, dampak) => {
    const total = kemungkinan * dampak;
    if (0 <= total && total <= 5) return "Rendah";
    else if (6 <= total && total <= 12) return "Sedang";
    else if (13 <= total && total <= 30) return "Tinggi";
    else return "";
  };

  return (
    <Grid container direction="column" spacing={2}>
      {/* <AlertDialog
        open={alertDialog.openAlertDialog}
        id="alert-dialog"
        onClose={handleCloseAlertDialog}
        message={alertDialog.messageAlertDialog}
        severity={alertDialog.severity}
      /> */}
      <Grid item>
        <Typography variant="h4" gutterBottom>
          {"Detail Kajian Risiko"}
        </Typography>
      </Grid>
      <Divider />
      <Grid item xs={6}>
        <TextField id="nomor"
          label="Nomor Risiko"
          fullWidth
          disabled
          className={classes.fieldDisabled}
          value={risiko.NORISK}
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
                  <Typography align="center" variant="body2"><b>Deskripsi</b></Typography>
                </Grid>
                <Grid item xs={2}>
                  <Typography align="center" variant="body2"><b>Kemungkinan</b></Typography>
                </Grid>
                <Grid item xs={2}>
                  <Typography align="center" variant="body2"><b>Dampak</b></Typography>
                </Grid>
                <Grid item xs={2}>
                  <Typography align="center" variant="body2"><b>Tingkat Risiko</b></Typography>
                </Grid>
                {/* <Grid item xs={1}>
                  <Typography align="center" variant="body2"><b>Actions</b></Typography>
                </Grid> */}
              </Grid>
              {risiko && risiko.LISTDETAIL
                .filter(r => !r.IDPARENT)
                // .map(f => ({
                //   deskripsi: f.NAMAFACTOR,
                //   kemungkinan: f.KODEMUNGKIN,
                //   dampak: f.KODEIMPACT,
                //   tingkatRisiko: hitungTingkatRisiko(parseInt(f.KODEMUNGKIN), parseInt(f.KODEIMPACT))
                // }))
                .map((d, i) =>
                  <Grid item key={"grid-cont-faktor-" + i} container direction="row" spacing={1} justify="space-between" alignItems="center">
                    <Grid key={"grid-deskripsi-faktor-" + i} item xs>
                      <TextField key={"deskripsi-faktor-" + i} id={"deskripsi-faktor-" + i} name={"deskripsi-faktor-" + i}
                        // variant="outlined"
                        fullWidth
                        multiline
                        size="small"
                        value={d.NAMAFACTOR}
                        disabled
                        className={classes.fieldDisabled}
                      // onChange={(event) => handleChangeFaktor(event.target.value, i, "deskripsi")}
                      // required
                      // error={errorFaktor[i].deskripsi.error}
                      // helperText={errorFaktor[i].deskripsi.text}
                      />
                    </Grid>
                    <Grid key={"grid-likely-faktor-" + i} item xs={2}>
                      <TextField key={"likely-faktor-" + i} id={"likely-faktor-" + i} name={"likely-faktor-" + i}
                        // variant="outlined"
                        fullWidth
                        // select
                        size="small"
                        value={kemungkinan.filter(k => k.value === d.KODEMUNGKIN)[0].label}
                        disabled
                        className={classes.fieldDisabled}
                      // onChange={(event) => handleChangeFaktor(event.target.value, i, "kemungkinan")}
                      // required
                      // error={errorFaktor[i].kemungkinan.error}
                      // helperText={errorFaktor[i].kemungkinan.text}
                      />
                      {/* <MenuItem value="">
                        <em>Pilih</em>
                      </MenuItem>
                      {kemungkinan.map((d) => (
                        <MenuItem key={"menu-likely-faktor-" + d.value} value={d.value}>
                          {d.label}
                        </MenuItem>
                      ))}
                    </TextField> */}
                    </Grid>
                    <Grid key={"grid-impact-faktor-" + i} item xs={2}>
                      <TextField key={"impact-faktor-" + i} id={"impact-faktor-" + i} name={"impact-faktor-" + i}
                        // variant="outlined"
                        fullWidth
                        // select
                        size="small"
                        value={dampak.filter(k => k.value === d.KODEIMPACT)[0].label}
                        disabled
                        className={classes.fieldDisabled}
                      // onChange={(event) => handleChangeFaktor(event.target.value, i, "dampak")}
                      // required
                      // error={errorFaktor[i].dampak.error}
                      // helperText={errorFaktor[i].dampak.text}
                      />
                      {/* <MenuItem value="">
                        <em>Pilih</em>
                      </MenuItem>
                      {dampak.map((d) => (
                        <MenuItem key={"menu-impact-faktor-" + d.value} value={d.value}>
                          {d.label}
                        </MenuItem>
                      ))}
                    </TextField> */}
                    </Grid>
                    <Grid key={"grid-riskrate-faktor-" + i} item xs={2}>
                      <TextField key={"riskrate-faktor-" + i} id={"riskrate-faktor-" + i} name={"riskrate-faktor-" + i}
                        fullWidth
                        size="small"
                        value={hitungTingkatRisiko(parseInt(d.KODEMUNGKIN), parseInt(d.KODEIMPACT))}
                        disabled
                        className={classes.fieldDisabled}
                      />
                    </Grid>
                    {/* <Grid key={"grid-action-faktor-" + i} item xs={1} container justify="center">
                    <IconButton key={"button-action-faktor-" + i} size="small" onClick={() => deleteRowFaktor(i)} disabled={disableIconDeleteFaktor(d)}>
                      <RemoveCircleOutline key={"icon-action-faktor-" + i} />
                    </IconButton>
                  </Grid> */}
                  </Grid>
                )
              }
              {/* <Grid item xs container justify="center">
                <Button fullWidth aria-label="add row faktor" size="small" onClick={addRowFaktor} >
                  <AddCircleOutline />
                </Button>
              </Grid> */}
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
                  <Typography align="center" variant="body2"><b>Faktor</b></Typography>
                </Grid>
                <Grid item xs>
                  <Typography align="center" variant="body2"><b>Deskripsi</b></Typography>
                </Grid>
                <Grid item xs={2}>
                  <Typography align="center" variant="body2"><b>Kemungkinan</b></Typography>
                </Grid>
                <Grid item xs={2}>
                  <Typography align="center" variant="body2"><b>Dampak</b></Typography>
                </Grid>
                <Grid item xs={2}>
                  <Typography align="center" variant="body2"><b>Tingkat Risiko</b></Typography>
                </Grid>
                {/* <Grid item xs={1}>
                  <Typography align="center" variant="body2"><b>Actions</b></Typography>
                </Grid> */}
              </Grid>
              {risiko && risiko.LISTDETAIL
                .filter(f => f.IDPARENT)
                .sort((a, b) => a.IDPARENT < b.IDPARENT)
                .map((d, i) =>
                  <Grid item key={"grid-cont-penanganan-" + i} container direction="row" spacing={1} justify="space-between" alignItems="center">
                    <Grid key={"grid-factor-penanganan-" + i} item xs>
                      <TextField key={"factor-penanganan-" + i} id={"factor-penanganan-" + i} name={"factor-penanganan-" + i}
                        // variant="outlined"
                        fullWidth
                        // select
                        multiline
                        size="small"
                        value={risiko.LISTDETAIL.filter(f => f.IDRISK === d.IDPARENT)[0].NAMAFACTOR}
                        disabled
                        className={classes.fieldDisabled}
                      // onChange={(event) => handleChangePenanganan(event.target.value, i, "faktor")}
                      // required
                      // error={errorPenanganan[i].faktor.error}
                      // helperText={errorPenanganan[i].faktor.text}
                      />
                      {/* <MenuItem value="">
                        <em>Pilih</em>
                      </MenuItem>
                      {listDataFaktor.map((d) => (
                        <MenuItem key={"menu-factor-penanganan-" + d.deskripsi} value={d.deskripsi}>
                          {d.deskripsi}
                        </MenuItem>
                      ))}
                    </TextField> */}
                      {/* <Autocomplete key={"factor-penanganan-" + i} id={"factor-penanganan-" + i} name={"factor-penanganan-" + i}
                        options={listDataFaktor || []}
                        getOptionLabel={option => option.deskripsi}
                        onChange={(e, v) => handleChangePenanganan(v.deskripsi, i, "faktor")}
                        value={d.faktor ? { deskripsi: d.faktor } : null}
                        getOptionSelected={
                          (option, value) => option.deskripsi === value.deskripsi
                        }
                        renderOption={(option) => (
                          <React.Fragment>
                            {option.deskripsi}
                          </React.Fragment>
                        )}
                        renderInput={params => (
                          <TextField
                            {...params}
                            fullWidth
                            multiline
                            variant="outlined"
                            size="small"
                            error={errorPenanganan[i].faktor.error}
                            helperText={errorPenanganan[i].faktor.text}
                          />
                        )}
                      /> */}
                    </Grid>
                    <Grid key={"grid-deskripsi-penanganan-" + i} item xs>
                      <TextField key={"deskripsi-penanganan-" + i} id={"deskripsi-penanganan-" + i} name={"deskripsi-penanganan-" + i}
                        // variant="outlined"
                        fullWidth
                        multiline
                        size="small"
                        value={d.NAMAFACTOR}
                        disabled
                        className={classes.fieldDisabled}
                      // onChange={(event) => handleChangePenanganan(event.target.value, i, "deskripsi")}
                      // required
                      // error={errorPenanganan[i].deskripsi.error}
                      // helperText={errorPenanganan[i].deskripsi.text}
                      />
                    </Grid>
                    <Grid key={"grid-likely-penanganan-" + i} item xs={2}>
                      <TextField key={"likely-penanganan-" + i} id={"likely-penanganan-" + i} name={"likely-penanganan-" + i}
                        // variant="outlined"
                        fullWidth
                        // select
                        size="small"
                        value={kemungkinan.filter(k => k.value === d.KODEMUNGKIN)[0].label}
                        disabled
                        className={classes.fieldDisabled}
                      // onChange={(event) => handleChangePenanganan(event.target.value, i, "kemungkinan")}
                      // required
                      // error={errorPenanganan[i].kemungkinan.error}
                      // helperText={errorPenanganan[i].kemungkinan.text}
                      />
                      {/* <MenuItem value="">
                          <em>Pilih</em>
                        </MenuItem>
                        {kemungkinan.map((d) => (
                          <MenuItem key={"menu-likely-penanganan-" + d.value} value={d.value}>
                            {d.label}
                          </MenuItem>
                        ))}
                      </TextField> */}
                    </Grid>
                    <Grid key={"grid-impact-penanganan-" + i} item xs={2}>
                      <TextField key={"impact-penanganan-" + i} id={"impact-penanganan-" + i} name={"impact-penanganan-" + i}
                        // variant="outlined"
                        fullWidth
                        // select
                        size="small"
                        value={dampak.filter(k => k.value === d.KODEIMPACT)[0].label}
                        disabled
                        className={classes.fieldDisabled}
                      // onChange={(event) => handleChangePenanganan(event.target.value, i, "dampak")}
                      // required
                      // error={errorPenanganan[i].dampak.error}
                      // helperText={errorPenanganan[i].dampak.text}
                      />
                      {/* <MenuItem value="">
                          <em>Pilih</em>
                        </MenuItem>
                        {dampak.map((d) => (
                          <MenuItem key={"menu-impact-penanganan-" + d.value} value={d.value}>
                            {d.label}
                          </MenuItem>
                        ))}
                      </TextField> */}
                    </Grid>
                    <Grid key={"grid-riskrate-penanganan-" + i} item xs={2}>
                      <TextField key={"riskrate-penanganan-" + i} id={"riskrate-penanganan-" + i} name={"riskrate-penanganan-" + i}
                        fullWidth
                        size="small"
                        value={hitungTingkatRisiko(parseInt(d.KODEMUNGKIN), parseInt(d.KODEIMPACT))}
                        disabled
                        className={classes.fieldDisabled}
                      />
                    </Grid>
                    {/* <Grid key={"grid-action-penanganan-" + i} item xs={1} container justify="center">
                    <IconButton key={"button-action-penanganan-" + i} size="small" onClick={() => deleteRowPenanganan(i)}>
                      <RemoveCircleOutline key={"icon-action-penanganan-" + i} />
                    </IconButton>
                  </Grid> */}
                  </Grid>
                )}
              {/* <Grid item xs container justify="center">
                <Button fullWidth aria-label="add row penanganan" size="small" onClick={addRowPenanganan} >
                  <AddCircleOutline />
                </Button>
              </Grid> */}
            </Grid>
          </Grid>
        </Paper>
      </Grid>
      {/* <Divider />
      <Grid item container direction="row" justify="flex-end">
        <Button onClick={loadingButton ? null : simpan} variant="contained" color="primary">
          {loadingButton ? <CircularProgress size={20} color="inherit" /> : edit ? "Ubah" : "Simpan"}
        </Button>
      </Grid> */}
    </Grid>
  );
}