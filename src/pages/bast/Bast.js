// import { useContext } from "react";
import { Button, CircularProgress, Divider, Grid, makeStyles, TextField, Typography } from "@material-ui/core";
import moment from "moment";
import { useState } from "react";
import AlertDialog from "../../components/AlertDialog";
import { approveBast } from "../../gateways/api/BastAPI";
// import { UserContext } from "../../utils/UserContext";

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
  space: {
    marginTop: theme.spacing(2),
  },
}));

const formatTanggal = (tanggal) => {
  if (!tanggal) {
    return null;
  } else {
    const tgl = moment(tanggal, "DD/MM/YYYY");
    let hari;
    switch (tgl.day()) {
      case 0:
        hari = "Minggu";
        break;
      case 1:
        hari = "Senin";
        break;
      case 2:
        hari = "Selasa";
        break;
      case 3:
        hari = "Rabu";
        break;
      case 4:
        hari = "Kamis";
        break;
      case 5:
        hari = "Jumat";
        break;
      case 6:
        hari = "Sabtu";
        break;
      default:
        hari = "Salah";
        break;
    }
    let bulan;
    switch (tgl.month()) {
      case 0:
        bulan = "Januari";
        break;
      case 1:
        bulan = "Februari";
        break;
      case 2:
        bulan = "Maret";
        break;
      case 3:
        bulan = "April";
        break;
      case 4:
        bulan = "Mei";
        break;
      case 5:
        bulan = "Juni";
        break;
      case 6:
        bulan = "Juli";
        break;
      case 7:
        bulan = "Agustus";
        break;
      case 8:
        bulan = "September";
        break;
      case 9:
        bulan = "Oktober";
        break;
      case 10:
        bulan = "November";
        break;
      case 11:
        bulan = "Desember";
        break;
      default:
        bulan = "Salah";
        break;
    }

    return (
      hari + " " + tgl.date() + " " + bulan + " " + tgl.year()
    );
  }
};

export default function Bast(props) {
  const { proyek, bast, otoritas, refresh } = props;
  // const { karyawan } = useContext(UserContext);
  const classes = useStyles();
  // console.log(bast);
  const [loadingButton, setLoadingButton] = useState(false);
  const [alertDialog, setAlertDialog] = useState({ openAlertDialog: false, messageAlertDialog: "", severity: "info" });

  const handleCloseAlertDialog = () => {
    setAlertDialog({ ...alertDialog, openAlertDialog: false });
  };

  const approve = () => {
    setLoadingButton(true);
    approveBast({ idproj: proyek.IDPROYEK })
      .then((response) => {
        setAlertDialog({ openAlertDialog: true, messageAlertDialog: "Berhasil simpan", severity: "success" });
        setLoadingButton(false);
      })
      .catch((error) => {
        setLoadingButton(false);
        if (error.response)
          setAlertDialog({ openAlertDialog: true, messageAlertDialog: error.response.data.message, severity: "error" });
        else
          setAlertDialog({ openAlertDialog: true, messageAlertDialog: error.message, severity: "error" });
      });
    // setTimeout(() => {
    //   console.log(proyek.IDPROYEK);
    //   setAlertDialog({ openAlertDialog: true, messageAlertDialog: "Berhasil simpan", severity: "success" });
    //   setLoadingButton(false);
    // }, 2000);
  };

  return (
    <Grid container direction="column" spacing={2}>
      <AlertDialog
        open={alertDialog.openAlertDialog}
        id="alert-dialog"
        onClose={alertDialog.severity === "success" ? () => { handleCloseAlertDialog(); refresh(null); } : handleCloseAlertDialog}
        message={alertDialog.messageAlertDialog}
        severity={alertDialog.severity}
      />
      <Grid item>
        <Typography variant="h4" gutterBottom>
          {"BAST (Berita Acara Serah Terima)"}
        </Typography>
      </Grid>
      <Divider />
      <Grid item xs={6}>
        <TextField id="nomor"
          label="Nomor BAST"
          fullWidth
          disabled
          className={classes.fieldDisabled}
          value={bast.nomor}
        />
      </Grid>
      <Grid item container spacing={3} direction="column" className={classes.space}>
        <Grid item xs={12} sm={6} container>
          <Typography variant="body1">
            Pada hari ini, {formatTanggal(bast.tanggalBa)}. Telah diserahkan/diimplementasikan
            Aplikasi Komputer sesuai permintaan user/pemohon, dari :
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6} container direction="column">
          <Grid item container direction="row" >
            <Grid item xs={3} >
              <Typography variant="body1">
                Nama
              </Typography>
            </Grid>
            <Grid item xs >
              <Typography variant="body1">
                : {bast.pm.nama}
              </Typography>
            </Grid>
          </Grid>
          <Grid item container direction="row" >
            <Grid item xs={3} >
              <Typography variant="body1">
                NIK
              </Typography>
            </Grid>
            <Grid item xs >
              <Typography variant="body1">
                : {bast.pm.nik}
              </Typography>
            </Grid>
          </Grid>
          <Grid item container direction="row" >
            <Grid item xs={3} >
              <Typography variant="body1">
                Unit Organisasi
              </Typography>
            </Grid>
            <Grid item xs >
              <Typography variant="body1">
                : {bast.pm.organisasi} / {bast.pm.nama_organisasi}
              </Typography>
            </Grid>
          </Grid>
          <Grid item container direction="row" >
            <Grid item xs={3} >
              <Typography variant="body1">
                Jabatan
              </Typography>
            </Grid>
            <Grid item xs >
              <Typography variant="body1">
                : {bast.pm.nama_jabatan || "-"}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} sm={6} container>
          <Typography variant="body1">
            Kepada user/pemohon :
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6} container direction="column">
          <Grid item container direction="row" >
            <Grid item xs={3} >
              <Typography variant="body1">
                Nama
              </Typography>
            </Grid>
            <Grid item xs >
              <Typography variant="body1">
                : {bast.user.nama}
              </Typography>
            </Grid>
          </Grid>
          <Grid item container direction="row" >
            <Grid item xs={3} >
              <Typography variant="body1">
                NIK
              </Typography>
            </Grid>
            <Grid item xs >
              <Typography variant="body1">
                : {bast.user.nik}
              </Typography>
            </Grid>
          </Grid>
          <Grid item container direction="row" >
            <Grid item xs={3} >
              <Typography variant="body1">
                Unit Organisasi
              </Typography>
            </Grid>
            <Grid item xs >
              <Typography variant="body1">
                : {bast.user.organisasi} / {bast.user.nama_organisasi}
              </Typography>
            </Grid>
          </Grid>
          <Grid item container direction="row" >
            <Grid item xs={3} >
              <Typography variant="body1">
                Jabatan
              </Typography>
            </Grid>
            <Grid item xs >
              <Typography variant="body1">
                : {bast.user.nama_jabatan || "-"}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} sm={6} container>
          <Typography variant="body1">
            Demikian berita acara serah terima ini, dengan harapan Aplikasi
            Komputer ini dipergunakan dengan sebaik-baiknya.
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6} container direction="row">
          <Grid item xs container direction="column">
            <Typography variant="body1">
              Persetujuan PM
            </Typography>
            <Typography variant="body1">
              {formatTanggal(bast.tanggalBa)}
            </Typography>
            <Typography variant="body1">
              {bast.pm.nama}
            </Typography>
          </Grid>
          <Grid item xs container direction="column" alignItems="flex-end">
            <Typography variant="body1" >
              Persetujuan User/BPO
            </Typography>
            {bast.approve === "0" && otoritas === "BPO" ?
              <Button onClick={loadingButton ? null : approve} color="primary" variant="contained" >
                {loadingButton ? <CircularProgress size={20} color="inherit" /> : "Setuju"}
              </Button>
              : <Typography variant="body1" >
                {formatTanggal(bast.tanggalApprove) || ""}
              </Typography>}
            <Typography variant="body1" >
              {bast.approve === "1" ? bast.user.nama : ""}
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}