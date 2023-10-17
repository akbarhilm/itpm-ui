import React, { useState, useEffect } from 'react';
import { Grid, Typography, TextField, makeStyles, Divider, Paper, IconButton, Checkbox, Dialog, DialogContent, Tooltip, DialogTitle } from '@material-ui/core';
import { AddCircleOutline, InfoOutlined, EditOutlined, Close, AssignmentTurnedInOutlined } from '@material-ui/icons';
import UatAdd from './UatAdd';
import { approveQA, getUatByIdProyek, getUatByIdUat } from '../../gateways/api/UatAPI';
import UatDetail from './UatDetail';
import UatApproval from './UatApproval';
import AlertDialog from '../../components/AlertDialog';

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

export default function Uat(props) {
  const { otoritas, listUat, proyek, status } = props;
  const classes = useStyles();

  const [refreshData, setRefreshData] = useState(false);
  const [data, setData] = useState([]);
  const [detailUat, setDetailUat] = useState();
  const [openDialogAdd, setOpenDialogAdd] = useState(false);
  const [openDialogEdit, setOpenDialogEdit] = useState(false);
  const [openDialogDetail, setOpenDialogDetail] = useState(false);
  const [openDialogApproval, setOpenDialogApproval] = useState(false);
  const [alertDialog, setAlertDialog] = useState(defaultAlert);

  const handleCloseAlertDialog = () => {
    setAlertDialog({ ...alertDialog, openAlertDialog: false });
  };

  const handleCloseDialogAdd = () => {
    setOpenDialogAdd(false);
  };

  useEffect(() => {
    if (listUat) {
      setData(listUat.map(d => ({
        id: d.IDUAT,
        nomor: d.NOUAT,
        approveQA: d.APROVEQA === "1" ? true : false,
        approveUser: d.APROVEUSER === "1" ? true : false
      })));
    }
  }, [listUat]);

  useEffect(() => {
    if (refreshData) {
      getUatByIdProyek(proyek.IDPROYEK)
        .then((response) => {
          setData(response.data.map(d => ({
            id: d.IDUAT,
            nomor: d.NOUAT,
            approveQA: d.APROVEQA === "1" ? true : false,
            approveUser: d.APROVEUSER === "1" ? true : false
          })));
          setRefreshData(false);
        })
        .catch(() => setRefreshData(false));
    }
  }, [refreshData, proyek]);

  const add = () => {
    setOpenDialogAdd(true);
  };

  const edit = (uat) => {
    getUatByIdUat(uat.id)
      .then((response) => {
        setDetailUat(response.data);
        setOpenDialogEdit(true);
      });
  };

  const detail = (uat) => {
    getUatByIdUat(uat.id)
      .then((response) => {
        setDetailUat(response.data);
        setOpenDialogDetail(true);
      });
  };

  const approve = (uat) => {
    getUatByIdUat(uat.id)
      .then((response) => {
        setDetailUat(response.data);
        setOpenDialogApproval(true);
      });
  };

  // dibutuhkan untuk approve qc, jika nanti ada aplikasi qa bisa dihapus/tidak dibutuhkan lagi
  const approveQC = (uat) => {
    approveQA({ iduat: uat.id })
      .then(response => {
        setAlertDialog({ openAlertDialog: true, messageAlertDialog: "Berhasil simpan", severity: "success" });
      })
      .catch(error => {
        if (error.response)
          setAlertDialog({ openAlertDialog: true, messageAlertDialog: error.response.data.message, severity: "error" });
        else
          setAlertDialog({ openAlertDialog: true, messageAlertDialog: error.message, severity: "error" });
      });
  };

  return (
    <Grid container direction="column" spacing={2}>
      {/* alert ini dibutuhkan untuk approve qc, jika nanti ada aplikasi qa bisa dihapus/tidak dibutuhkan lagi */}
      <AlertDialog
        open={alertDialog.openAlertDialog}
        id="alert-dialog"
        onClose={alertDialog.severity === "success" ? () => { handleCloseAlertDialog(); setRefreshData(true); } : handleCloseAlertDialog}
        message={alertDialog.messageAlertDialog}
        severity={alertDialog.severity}
      />
      <Grid item>
        <Typography variant="h4" gutterBottom>
          {"UAT (User Acceptence Test)"}
        </Typography>
      </Grid>
      <Divider />
      <Grid item >
        <Paper className={classes.paper}>
          <Grid container direction="column" spacing={2}>
            {otoritas === "PM" && data.every(d => d.approveUser) && !status.APPROVEBA && <Grid item container justifyContent="flex-end" >
              <Tooltip title="Tambah Data">
                <IconButton onClick={add} >
                  <AddCircleOutline />
                </IconButton>
              </Tooltip>
            </Grid>}
            <Grid item container direction="column" spacing={1}>
              <Grid item container direction="row" spacing={2} justifyContent="space-between">
                <Grid item xs>
                  <Typography align="center" variant="body2"><b>Nomor UAT</b></Typography>
                </Grid>
                <Grid item xs={2}>
                  <Typography align="center" variant="body2"><b>Persetujuan QC</b></Typography>
                </Grid>
                <Grid item xs={2}>
                  <Typography align="center" variant="body2"><b>Persetujuan User</b></Typography>
                </Grid>
                <Grid item xs={1}>
                  <Typography align="center" variant="body2"><b>Actions</b></Typography>
                </Grid>
              </Grid>
              {data && data.map((d, i) =>
                <Grid item key={"grid-cont-" + i} container direction="row" spacing={2} justifyContent="space-between" alignItems="center">
                  <Grid key={"grid-nomor-" + i} item xs>
                    <TextField key={"nomor-" + i} id={"nomor-" + i} name={"nomor-" + i}
                      fullWidth
                      multiline
                      size="small"
                      value={d.nomor}
                      disabled
                      className={classes.fieldDisabled}
                    />
                  </Grid>
                  <Grid key={"grid-qc-" + i} item xs={2} container justifyContent="center" >
                    <Checkbox key={"qc-" + i} id={"qc-" + i} name={"qc-" + i}
                      disabled
                      checked={d.approveQA}
                    />
                  </Grid>
                  <Grid key={"grid-user-" + i} item xs={2} container justifyContent="center" >
                    <Checkbox key={"user-" + i} id={"user-" + i} name={"user-" + i}
                      disabled
                      checked={d.approveUser}
                    />
                  </Grid>
                  <Grid item xs={1} container justifyContent="center">
                    {d.approveUser || (d.approveQA && otoritas !== "BPO") || (!d.approveQA && otoritas !== "PM") ?
                      <Tooltip title="Detail">
                        <IconButton size="small" onClick={() => detail(d)}>
                          <InfoOutlined />
                        </IconButton>
                      </Tooltip> : null}
                    {!d.approveQA && otoritas === "PM" && <Tooltip title="Ubah Data">
                      <IconButton size="small" onClick={() => edit(d)}>
                        <EditOutlined />
                      </IconButton>
                    </Tooltip>}
                    { // jika nanti sudah ada aplikasi qa, ini tidak dibutuhkan lagi
                      !d.approveQA && otoritas === "QA" && <Tooltip title="Setuju QC">
                        <IconButton size="small" onClick={() => approveQC(d)}>
                          <AssignmentTurnedInOutlined />
                        </IconButton>
                      </Tooltip>}
                    {d.approveQA && otoritas === "BPO" && !d.approveUser && <Tooltip title="Persetujuan UAT">
                      <IconButton size="small" onClick={() => approve(d)}>
                        <AssignmentTurnedInOutlined />
                      </IconButton>
                    </Tooltip>}
                  </Grid>
                </Grid>
              )}
            </Grid>
          </Grid>
        </Paper>
      </Grid >
      < Dialog open={openDialogAdd} onClose={handleCloseDialogAdd} maxWidth="lg" fullWidth >
        <DialogTitle disableTypography >
          <Grid container justifyContent="flex-end">
            <IconButton
              size="small"
              onClick={handleCloseDialogAdd}
            >
              <Close />
            </IconButton>
          </Grid>
        </DialogTitle>
        <DialogContent>
          <UatAdd proyek={proyek} uat={({})} onClose={handleCloseDialogAdd} refresh={() => setRefreshData(true)} />
        </DialogContent>
      </Dialog >
      <Dialog open={openDialogEdit} onClose={() => setOpenDialogEdit(false)} maxWidth="lg" fullWidth >
        <DialogTitle disableTypography >
          <Grid container justifyContent="flex-end">
            <IconButton
              size="small"
              onClick={() => setOpenDialogEdit(false)}
            >
              <Close />
            </IconButton>
          </Grid>
        </DialogTitle>
        <DialogContent>
          <UatAdd proyek={proyek} uat={detailUat} onClose={() => setOpenDialogEdit(false)} />
        </DialogContent>
      </Dialog>
      <Dialog open={openDialogDetail} onClose={() => setOpenDialogDetail(false)} maxWidth="lg" fullWidth >
        <DialogTitle disableTypography >
          <Grid container justifyContent="flex-end">
            <IconButton
              size="small"
              onClick={() => setOpenDialogDetail(false)}
            >
              <Close />
            </IconButton>
          </Grid>
        </DialogTitle>
        <DialogContent>
          <UatDetail proyek={proyek} uat={detailUat} />
        </DialogContent>
      </Dialog>
      <Dialog open={openDialogApproval} onClose={() => setOpenDialogApproval(false)} maxWidth="lg" fullWidth >
        <DialogTitle disableTypography >
          <Grid container justifyContent="flex-end">
            <IconButton
              size="small"
              onClick={() => setOpenDialogApproval(false)}
            >
              <Close />
            </IconButton>
          </Grid>
        </DialogTitle>
        <DialogContent>
          <UatApproval proyek={proyek} uat={detailUat} onClose={() => setOpenDialogApproval(false)} refresh={() => setRefreshData(true)} />
        </DialogContent>
      </Dialog>
    </Grid >
  );
};;
