import React, { useState, useEffect,useCallback } from "react";
import AlertDialog from "../../components/AlertDialog";
import {
  Grid,
  makeStyles,
  Typography,
  TextField,
  
  Paper,
  Button,
  Divider,
  
  IconButton,
  
  CircularProgress,
  MenuItem,
} from "@material-ui/core";
import {
  addPorto,
  getgrup,
  getkode,
  uploadFile,
  getCata,
  getPortoById,
  updatePorto
} from "../../gateways/api/PortoApi";
import {
  AddCircleOutline,
  RemoveCircleOutline,
  
} from "@material-ui/icons";
import PublishIcon from "@material-ui/icons/Publish";
import { KeyboardDatePicker } from "@material-ui/pickers";
import moment from "moment";

const defaultError = {
  kode: { error: false, text: "" },
  cata: { error: false, text: "" },
  aplikasi: { error: false, text: "" },
  bpo: { error: false, text: "" },
  grup: { error: false, text: "" },
  url: { error: false, text: "" },
  status: { error: false, text: "" },
  dev: { error: false, text: "" },
  tipe: { error: false, text: "" },
  namafile: { error: false, text: "" },
  publish: { error: false, text: "" },
  retired: { error: false, text: "" },
};
const defaultErrorDetail = {
  item: { error: false, text: "" },
  nama: { error: false, text: "" },
  keterangan: { error: false, text: "" },
  status: { error: false, text: "" },
};

const err = { error: true, text: "Tidak boleh kosong." };
const errfile = { error: true, text: "Upload file sebelum simpan." };
const noErr = { error: false, text: "" };

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
  },
  paperStepper: {
    padding: theme.spacing(2),
    color: theme.palette.text.secondary,
    background: "#90caf9",
  },
  radio: {
    margin: "6px 0px 1px 15px",
  },
  field: {
    margin: "6px 0px 6px 0px",
  },
  field2: {
    margin: "6px 0px 6px 0px",
    width: "85%",
  },
  fieldDisabled: {
    margin: "6px 0px 6px 0px",
    "& .MuiInputBase-root.Mui-disabled": {
      color: "rgba(0, 0, 0, 1)", // (default alpha is 0.38)
    },
  },
}));

const defaultAlert = {
  openAlertDialog: false,
  messageAlertDialog: "",
  severity: "info",
};
const defaultDataDetail = {
  item: '',
  nama: '',
  keterangan: '',
  status: "",
};
const defaultDataHead = {
  idporto:"",
  kode: "",
  cata: "",
  aplikasi: "",
  bpo: "",
  grup: "",
  url: "",
  status: "",
  dev: "",
  tipe: "",
  namafile: "",
  publish: null,
  retired: null,
};
export default function TambahPorto(props) {
  const { proyek } = props;
  const classes = useStyles();

  const [loadingButton, setLoadingButton] = useState(false);
  const [edit, setEdit] = useState(false);
  const [errorHead, setErrorHead] = useState(defaultError);
  const [errorDetail, setErrorDetail] = useState([]);
  const [alertDialog, setAlertDialog] = useState(defaultAlert);
  const [kode, setKode] = useState([]);
  const [grup, setGrup] = useState([]);
  const [dataHead, setDataHead] = useState(defaultDataHead);
  const [dataDetail, setDataDetail] = useState([]);
  const [file, setFile] = useState(null);
  const [upl, setUpl] = useState(false);
  const [cata, setCata] = useState([]);

  const formatdetail = useCallback((listdetail) => {
   const dt =  listdetail.map((d)=>({
      item:d.MODELNUMBER,
      nama:d.NAMAMODUL,
      keterangan:d.KETMODUL,
      status:d.STATUSITEM
    }))
    console.log(dt);
    return dt
  },[])

  useEffect(() => {
    if (proyek) {
     
      getPortoById(proyek.IDPORTO).then((res) => {
        setEdit(true);
        setDataHead({
          idporto:res.data.IDPORTO,
          kode: res.data.KODEPORTO,

          cata: res.data.KODESERVIS,
          aplikasi: res.data.NAMAAPLIKASI,
          bpo: res.data.NAMAOWNER,
          grup: res.data.KODEGRUP,
          url: res.data.URL,
          status: res.data.STATUS,
          dev: res.data.PENGEMBANG,
          tipe: res.data.TIPEAPLIKASI,
          namafile: res.data.NAMAFILE,
          publish: moment(res.data.PUBLISH,"DD/MM/YYYY"),
          retired: moment(res.data.RETIRED,"DD/MM/YYYY"),
        });
        
        const dtl = formatdetail(res.data.LISTDETAIL)
        setErrorDetail(dtl.map(d=>defaultErrorDetail))
        setDataDetail(dtl)
       
       
       
      })
      .catch((error) => {
        if (error.response)
          setAlertDialog({ openAlertDialog: true, messageAlertDialog: error.response.data.message, severity: "error" });
        else
          setAlertDialog({ openAlertDialog: true, messageAlertDialog: error.message, severity: "error" });
      });
    }
  },[proyek,formatdetail]);
  
  useEffect(() => {
    if (kode.length === 0) {
      getkode().then((res) => {
        setKode(res.data);
      });
    }
  }, [kode]);

  useEffect(() => {
    if (grup.length === 0) {
      getgrup().then((res) => {
        setGrup(res.data);
      });
    }
  }, [grup]);

  useEffect(() => {
    if (cata.length === 0) {
      getCata().then((res) => {
        setCata(res.data);
      });
    }
  }, [cata]);

  const handleCloseAlertDialog = () => {
    setAlertDialog({ ...alertDialog, openAlertDialog: false });
  };

  const addRow = () => {
    console.log(errorDetail);
    let newArrayError = [...errorDetail];
    newArrayError.push(defaultErrorDetail);
    console.log(newArrayError);
    setErrorDetail(newArrayError);

    let newArray = [...dataDetail];

    newArray.push(defaultDataDetail);

    setDataDetail(newArray);
  };

  const deleteRow = (index) => {
    let newArrayError = [...errorDetail];
    newArrayError.splice(index, 1);
    setErrorDetail(newArrayError);

    let newArray = [...dataDetail];
    newArray.splice(index, 1);
    setDataDetail(newArray);
  };

  const handleSelect = (event, key) => {
    if (key === "status") {
      const st = event.target.value;
      setDataHead((prev) => ({
        ...prev,
        [key]: st,
        publish: null,
        retired: null,
      }));
    } else if (key === "publish" || key === "retired") {
      setDataHead((prev) => ({ ...prev, [key]: event }));
    } else if (key === "dev") {
      const kd =
        "PORTO-" +
        event.target.value +
        "-" +
        kode[0].NEXT +
        "-" +
        new Date().getFullYear();

      setDataHead((prev) => ({
        ...prev,
        [key]: event.target.value,
        kode: kd.replace(/\s/g, ""),
      }));
    } else {
      setDataHead((prev) => ({ ...prev, [key]: event.target.value }));
    }
  };

  const handleChangeTF = (event, key) => {
    setDataHead((prev) => ({ ...prev, [key]: event.target.value }));
  };

  const handleFile = (e) => {
    if (e.target.files) {
      setFile(e.target.files[0]);

      console.log(e.target.files[0]);
    }
  };

  const handleSubmit = () => {
    if (file) {
      const formData = new FormData();
      formData.append("file", file, kode[0].NEXT + "-porto-" + file.name);

      uploadFile(formData)
        .then((res) =>
          setAlertDialog({
            openAlertDialog: true,
            messageAlertDialog: res.data.message,
            severity: res.status === 200 ? "info" : "error",
          })
        )
        .then(setUpl(true))
        .then(
          setDataHead((prev) => ({
            ...prev,
            namafile: kode[0].NEXT + "-porto-" + file.name,
          }))
        );
    } else {
      setAlertDialog({
        openAlertDialog: true,
        messageAlertDialog: "Pilih File terlebih dahulu",
        severity: "error",
      });
    }
  };

  const validateLength255 = (value) => {
    if (value.length <= 200) return true;
    else return false;
  };

  const handleChangeTFD = (value, index, key) => {
    // let newError = [...errorFaktor];
    // newError[index] = { ...newError[index], [key]: value ? noErr : err };
    // setErrorFaktor(newError);

    const val = value.target.value;

    let newArray = [...dataDetail];

    if (key === "item") {
      newArray[index] = {
        ...newArray[index],
        [key]: val.replace(/[^\d]/g, ""),
      };

      setDataDetail(newArray);
    } else if (key === "nama" || key === "status") {
      newArray[index] = { ...newArray[index], [key]: val };
      setDataDetail(newArray);
    } else if (key === "keterangan" && validateLength255(val)) {
      newArray[index] = { ...newArray[index], [key]: val };
      setDataDetail(newArray);
    }
  };

  const validateAll = () => {
    setErrorHead({
      kode: dataHead.kode ? noErr : err,
      aplikasi: dataHead.aplikasi ? noErr : err,
      cata : dataHead.cata?noErr : err,
      bpo: dataHead.bpo ? noErr : err,
      grup: dataHead.grup ? noErr : err,
      url: dataHead.url ? noErr : err,
      status: dataHead.status ? noErr : err,
      dev: dataHead.dev ? noErr : err,
      tipe: dataHead.tipe ? noErr : err,
      namafile: file ? (dataHead.namafile ? noErr : errfile) : noErr,
      publish:
        dataHead.status === "KATALOG"
          ? dataHead.publish
            ? noErr
            : err
          : noErr,
      retired:
        dataHead.status === "RETIRED"
          ? dataHead.retired
            ? noErr
            : err
          : noErr,
    });
    
    setErrorDetail((prev) =>
   
      prev.map((er, i) => {
        const newObj = {
        item: dataDetail[i].item ? noErr : err,
          nama: dataDetail[i].nama ? noErr : err,
          // role: data[i].role ? noErr : err,
          keterangan: dataDetail[i].keterangan ? noErr : err,
          status: dataDetail[i].status ? noErr : err,
        };
        return newObj;
      })
    );

    if (
      dataHead.kode &&
      dataHead.aplikasi &&
      dataHead.cata &&
      dataHead.bpo &&
      dataHead.grup &&
      dataHead.url &&
      dataHead.status &&
      dataHead.dev &&
      dataHead.tipe &&
      (dataHead.status === 'KATALOG'? dataHead.publish? true : false : true) &&
      (dataHead.status === 'RETIRED'? dataHead.retired? true : false : true) &&
      dataDetail.every(
        (dt) => dt.item && dt.nama && dt.keterangan && dt.status
      ) &&
      (
      file
        ? dataHead.namafile
          ? true
          : false
        : true)
    ) {
      return true;
    } else return false;
  };

  const simpan = () => {
    setLoadingButton(true);
    if (dataDetail.length > 0) {
      if (validateAll()) {
        const listdetail = dataDetail.map((dt) => ({
          item: dt.item,
          nama: dt.nama,
          // idrole : dt.role.id,
          keterangan: dt.keterangan,
          status: dt.status,
        }));
        console.log(dataHead);
        const formatData = {
          ...dataHead,
          publish: dataHead.publish
            ? moment(dataHead.publish).format("DD/MM/YYYY")
            : "",
          retired: dataHead.retired
            ? moment(dataHead.retired).format("DD/MM/YYYY")
            : "",
          listdetail: listdetail,
        };

        if (edit) {
          updatePorto(formatData)
            .then((response) => {
              //setData(formatNewData(response.data.LISTDETAIL));
              setAlertDialog({ openAlertDialog: true, messageAlertDialog: "Berhasil ubah", severity: "success" });
              setLoadingButton(false);
            })
            .catch((error) => {
              setLoadingButton(false);
              if (error.response)
                setAlertDialog({ openAlertDialog: true, messageAlertDialog: error.response.data.message, severity: "error" });
              else
                setAlertDialog({ openAlertDialog: true, messageAlertDialog: error.message, severity: "error" });
            });
        } else {
         
          addPorto(formatData)
            .then((response) => {
              console.log(response);
              setEdit(true);
              setDataHead((prev)=>({...prev,idporto:response.data[0].IDPORTO}))
              setAlertDialog({
                openAlertDialog: true,
                messageAlertDialog: "Berhasil simpan",
                severity: "success",
              });
              setLoadingButton(false);
            })
            .catch((error) => {
              setLoadingButton(false);
              if (error.response)
                setAlertDialog({
                  openAlertDialog: true,
                  messageAlertDialog: error.response.data.message,
                  severity: "error",
                });
              else
                setAlertDialog({
                  openAlertDialog: true,
                  messageAlertDialog: error.message,
                  severity: "error",
                });
            });
        }
      } else {
        setAlertDialog({
          openAlertDialog: true,
          messageAlertDialog: "Silahkan periksa data yang anda masukkan.",
          severity: "warning",
        });
        setLoadingButton(false);
      }
    } else {
      setAlertDialog({
        openAlertDialog: true,
        messageAlertDialog:
          "Data kosong. Silahkan periksa data yang anda masukkan.",
        severity: "warning",
      });
      setLoadingButton(false);
    }
  };

  return (
    <Grid container direction="column" spacing={2}>
    {console.log(dataHead)}
      <AlertDialog
        open={alertDialog.openAlertDialog}
        id="alert-dialog"
        onClose={handleCloseAlertDialog}
        message={alertDialog.messageAlertDialog}
        severity={alertDialog.severity}
      />
      <Grid item>
        <Typography variant="h4" gutterBottom>
          {edit ? "Ubah Portofolio" : "Tambah Portofolio"}
        </Typography>
      </Grid>
      <Divider />
      <Grid item>
        <Paper className={classes.paper}>
          <Grid container direction="column" spacing={2}>
            <Grid item>
              <Typography variant="h6" gutterBottom>
                {"Portofolio"}
              </Typography>
            </Grid>
            <Grid
              item
              container
              direction="row"
              spacing={2}
              justify="space-between"
            >
              <Grid item xs={6} container direction="column">
                <TextField
                  label="Kode Portofolio"
                  variant="outlined"
                  className={classes.field}
                  fullWidth
                  disabled
                  value={dataHead ? dataHead.kode : ""}
                />
                <TextField
                  label="Kode katalog"
                  variant="outlined"
                  className={classes.field}
                  fullWidth
                  select
                  onChange={(e) => handleSelect(e, "cata")}
                  value={dataHead ? dataHead.cata : ''}
                  error={errorHead.cata.error}
                      helperText={errorHead.cata.text}
                >
                  {cata.map((d, i) => (
                    <MenuItem value={d.KODE} key={i}>
                      {d.NAMA}
                    </MenuItem>
                  ))}
                 
                </TextField>

                <Grid
                  item
                  container
                  direction="row"
                  spacing={2}
                  justify="space-between"
                >
                  <Grid item xs>
                    <TextField
                      label="Nama Aplikasi"
                      variant="outlined"
                      className={classes.field}
                      fullWidth
                      onChange={(e) => handleChangeTF(e, "aplikasi")}
                      value={dataHead ? dataHead.aplikasi : ""}
                      error={errorHead.aplikasi.error}
                      helperText={errorHead.aplikasi.text}
                    />
                  </Grid>
                  <Grid item xs>
                    <TextField
                      label="Nama BPO"
                      variant="outlined"
                      className={classes.field}
                      fullWidth
                      onChange={(e) => handleChangeTF(e, "bpo")}
                      value={dataHead ? dataHead.bpo : ""}
                      error={errorHead.bpo.error}
                      helperText={errorHead.bpo.text}
                    />
                  </Grid>
                </Grid>
                <Grid
                  item
                  container
                  direction="row"
                  spacing={2}
                  justify="space-between"
                >
                  <Grid item xs>
                    <TextField
                      label="Group"
                      variant="outlined"
                      className={classes.field}
                      fullWidth
                      select
                      onChange={(e) => handleSelect(e, "grup")}
                      value={dataHead ? dataHead.grup : ""}
                      error={errorHead.grup.error}
                      helperText={errorHead.grup.text}
                    >
                      {grup.map((d, i) => (
                        <MenuItem value={d.KODEGRUP} key={i}>
                          {d.NAMAGRUP}
                        </MenuItem>
                      ))}
                     
                    </TextField>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={6} container direction="column">
                <Grid
                  item
                  container
                  direction="row"
                  spacing={2}
                  justify="space-between"
                >
                  <Grid item xs>
                    <TextField
                      label="URL"
                      variant="outlined"
                      className={classes.field}
                      fullWidth
                      onChange={(e) => handleChangeTF(e, "url")}
                      value={dataHead ? dataHead.url : ""}
                      error={errorHead.url.error}
                      helperText={errorHead.url.text}
                    />
                  </Grid>
                  <Grid item xs>
                    <TextField
                      label="Status"
                      variant="outlined"
                      className={classes.field}
                      fullWidth
                      select
                      onChange={(e) => handleSelect(e, "status")}
                      value={dataHead ? dataHead.status : ""}
                      error={errorHead.status.error}
                      helperText={errorHead.status.text}
                    >
                      <MenuItem value={"PIPELINE"}>PIPELINE</MenuItem>
                      <MenuItem value={"KATALOG"}>KATALOG</MenuItem>
                      <MenuItem value={"RETIRED"}>RETIRED</MenuItem>
                    
                    </TextField>
                  </Grid>
                </Grid>
                <TextField
                  label="Developer"
                  variant="outlined"
                  className={classes.field}
                  fullWidth
                  select
                  onChange={(e) => handleSelect(e, "dev")}
                  value={dataHead ? dataHead.dev : ""}
                  error={errorHead.dev.error}
                      helperText={errorHead.dev.text}
                >
                  <MenuItem value={"IT"}>Divisi IT</MenuItem>
                  <MenuItem value={"EXTERNAL"}>External</MenuItem>
                
                </TextField>
                <Grid
                  item
                  container
                  direction="row"
                  spacing={2}
                  justify="space-between"
                >
                  <Grid item xs>
                    <TextField
                      label="Tipe"
                      variant="outlined"
                      className={classes.field}
                      fullWidth
                      select
                      onChange={(e) => handleSelect(e, "tipe")}
                      value={dataHead ? dataHead.tipe : ""}
                      error={errorHead.tipe.error}
                      helperText={errorHead.tipe.text}
                    >
                      <MenuItem value={"INTERNET"}>Internet</MenuItem>
                      <MenuItem value={"INTRANET"}>Intranet</MenuItem>

                      {/* </Select> */}
                    
                    </TextField>
                  </Grid>
                  <Grid item xs>
                    <TextField
                      label="Nama File"
                      variant="outlined"
                      className={classes.field}
                      fullWidth
                      //onChange={(e) => handleChangeTF(e, "logo")}
                      disabled
                      value={dataHead ? dataHead.namafile : ""}
                      error={errorHead.namafile.error}
                      helperText={errorHead.namafile.text}
                    />
                  </Grid>
                </Grid>
                <Grid
                  item
                  container
                  direction="row"
                  spacing={2}
                  justify="space-between"
                >
                  <Grid item xs>
                    <KeyboardDatePicker
                      key={"mulai-"}
                      id={"mulai-"}
                      name={"mulai-"}
                      fullWidth
                      clearable
                      format="DD/MM/YYYY"
                      size="small"
                      value={dataHead ? dataHead.publish : null}
                      // minDate={minDate ? moment(minDate, "DD/MM/YYYY") : moment("1900-01-01", "YYYY-MM-DD")}
                      onChange={(value) => handleSelect(value, "publish")}
                      // error={error[i].tanggalMulai.error}
                      // helperText={error[i].tanggalMulai.text}
                      // inputVariant={d.disabled ? "standard" : "outlined"}
                      views={["year", "month", "date"]}
                      disabled={
                        dataHead.status === "KATALOG" ? false : true || false
                      }
                      className={classes.field}
                      error={errorHead.publish.error}
                      helperText={errorHead.publish.text}
                    />
                  </Grid>
                  <Grid item xs>
                    <KeyboardDatePicker
                      key={"mulai-"}
                      id={"mulai-"}
                      name={"mulai-"}
                      fullWidth
                      clearable
                      format="DD/MM/YYYY"
                      size="small"
                      value={dataHead ? dataHead.retired : null}
                      // minDate={minDate ? moment(minDate, "DD/MM/YYYY") : moment("1900-01-01", "YYYY-MM-DD")}
                      onChange={(e) => handleSelect(e, "retired")}
                      // error={error[i].tanggalMulai.error}
                      // helperText={error[i].tanggalMulai.text}
                      // inputVariant={d.disabled ? "standard" : "outlined"}
                      views={["year", "month", "date"]}
                      disabled={
                        dataHead.status === "RETIRED" ? false : true || false
                      }
                      className={classes.field}
                      error={errorHead.retired.error}
                      helperText={errorHead.retired.text}
                    />
                  </Grid>
                </Grid>
                <Grid item xs>
                  <TextField
                    accept="image/*"
                    //style={{display:'none'}}
                    id="contained-button-file"
                    name="file"
                    onChange={(e) => handleFile(e)}
                    multiple
                    type="file"
                    value={dataHead?.logo}
                  />

                  <Button
                    variant="contained"
                    disabled={upl}
                    onClick={handleSubmit}
                    color="primary"
                    startIcon={<PublishIcon />}
                    component="span"
                  >
                    Upload
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
      <Divider />
      <Grid item>
        <Paper className={classes.paper}>
          <Grid container direction="column" spacing={2}>
            <Grid item container direction="row" justify="space-between">
              <Grid item xs>
                <Typography variant="h6">Detail Portofolio</Typography>
              </Grid>
            </Grid>
            <Grid item container direction="column" spacing={1}>
              <Grid
                item
                container
                direction="row"
                spacing={1}
                justify="space-between"
              >
                <Grid item xs={2}>
                  <Typography align="center" variant="body2">
                    <b>Item</b>
                  </Typography>
                </Grid>
                <Grid item xs={2}>
                  <Typography align="center" variant="body2">
                    <b>Modul</b>
                  </Typography>
                </Grid>
                <Grid item xs={2}>
                  <Typography align="center" variant="body2">
                    <b>Keterangan</b>
                  </Typography>
                </Grid>
                <Grid item xs={1}>
                  <Typography align="center" variant="body2">
                    <b>Status</b>
                  </Typography>
                </Grid>
                <Grid item xs={1}>
                  <Typography align="center" variant="body2">
                    <b>Actions</b>
                  </Typography>
                </Grid>
              </Grid>
              {dataDetail &&
                dataDetail.map((d, i) => (
                  <Grid
                    item
                    key={"grid-cont-" + i}
                    container
                    direction="row"
                    spacing={1}
                    justify="space-between"
                    alignItems="flex-start"
                  >
                    <Grid key={"grid-item-" + i} item xs>
                      <TextField
                        label="Item"
                        variant="outlined"
                        className={classes.field}
                        fullWidth
                        inputProps={{
                          maxLength: 4,
                        }}
                        onChange={(e) => handleChangeTFD(e, i, "item")}
                        value={d.item}
                        //error={d.item === ''?true:false}
                       // helperText={d.item === ''?'Tidak Boleh Kosong':''}
                          error={errorDetail[i].item.error}
                       helperText={errorDetail[i].item.text}
                      />
                    </Grid>
                    <Grid key={"grid-nama-" + i} item xs>
                      <TextField
                        label="Nama"
                        variant="outlined"
                        className={classes.field}
                        fullWidth
                        inputProps={{
                          maxLength: 50,
                        }}
                        onChange={(e) => handleChangeTFD(e, i, "nama")}
                        value={d.nama}
                        // error={d.nama === ''?true:false}
                        // helperText={d.nama === ''?'Tidak Boleh Kosong':''}
                        error={errorDetail[i].nama.error}
                        helperText={errorDetail[i].nama.text}
                      />
                    </Grid>
                    <Grid key={"grid-ket-" + i} item xs>
                      <TextField
                        label="Keterangan"
                        variant="outlined"
                        className={classes.field}
                        fullWidth
                        inputProps={{
                          maxLength: 200,
                        }}
                        onChange={(e) => handleChangeTFD(e, i, "keterangan")}
                        value={d.keterangan}
                        error={errorDetail[i].keterangan.error}
                        helperText={errorDetail[i].keterangan.text}
                        // error={d.keterangan === ''?true:false}
                        // helperText={d.keterangan === ''?'Tidak Boleh Kosong':''}
                      />
                    </Grid>
                    <Grid key={"grid-status-" + i} item xs>
                      <TextField
                        label="status"
                        variant="outlined"
                        className={classes.field}
                        fullWidth
                        select
                        onChange={(e) => handleChangeTFD(e, i, "status")}
                        value={d.status}
                      >
                        <MenuItem value={"A"}>AKTIF</MenuItem>
                        <MenuItem value={"D"}>TIDAK AKTIF</MenuItem>
                      </TextField>
                    </Grid>
                    <Grid item xs={1} container justify="center">
                      <IconButton
                        size="small"
                        onClick={() => deleteRow(i)}
                        disabled={d.disabled}
                      >
                        <RemoveCircleOutline />
                      </IconButton>
                    </Grid>
                  </Grid>
                ))}
              <Grid item xs container justify="center">
                <Button
                  fullWidth
                  aria-label="add row action plan"
                  size="small"
                  onClick={addRow}
                >
                  <AddCircleOutline />
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
      <Divider />
      <Grid item container direction="row" justify="flex-end">
        <Button
          onClick={loadingButton ? null : simpan}
          variant="contained"
          color="primary"
        >
          {loadingButton ? (
            <CircularProgress size={20} color="inherit" />
          ) : edit ? (
            "Ubah"
          ) : (
            "Simpan"
          )}
        </Button>
      </Grid>
    </Grid>
  );
}
