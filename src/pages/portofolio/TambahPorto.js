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
  updatePorto,
  deletePorto,
  downloadFile
} from "../../gateways/api/PortoApi";
import {
  AddCircleOutline,
  RemoveCircleOutline,
  
} from "@material-ui/icons";
import VisibilityIcon from '@material-ui/icons/Visibility';
import { KeyboardDatePicker } from "@material-ui/pickers";
import moment from "moment";


import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';
import { useHistory } from "react-router-dom";

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
  publishdetail:{ error: false, text: "" },
  retireddetail:{ error: false, text: "" }
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
  publishdetail:null,
  retireddetail:null
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
  hapus:""
};

function ConfirmationDialogRaw(props) {
  const { onClose, value: valueProp, open, ...other } = props;
  // const [value, setValue] = React.useState(valueProp);


  // React.useEffect(() => {
  //   if (!open) {
  //     setValue(valueProp);
  //   }
  // }, [valueProp, open]);



  const handleCancel = () => {
    onClose();
  };

  const handleOk = () => {
    onClose(true);
  };



  return (
    <Dialog
      maxWidth="xs"
     
      aria-labelledby="confirmation-dialog-title"
      open={open}
      {...other}
    >
      
      <DialogContent dividers>
       <Typography>Apakah Anda Yakin Data akan dihapus?</Typography>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleCancel} color="primary">
          Cancel
        </Button>
        <Button onClick={handleOk} color="primary">
          Ok
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default function TambahPorto(props) {
  const { proyek } = props;
  const classes = useStyles();
  const history = useHistory();
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
  const [cata, setCata] = useState([]);
  const [openDialog, setOpenDialog] = React.useState(false);

  // const [valueDialog, setValueDialog] = React.useState('');

  const formatdetail = useCallback((listdetail) => {
   const dt =  listdetail.map((d)=>({
      item:d.MODELNUMBER,
      nama:d.NAMAMODUL,
      keterangan:d.KETMODUL,
      status:d.STATUSITEM,
      publishdetail:d.TGLITEMPUBISH,
      retireddetail:d.TGLITEMRETIRED
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
          publish: res.data.PUBLISH?moment(res.data.PUBLISH,"DD/MM/YYYY"):null,
          retired: res.data.RETIRED?moment(res.data.RETIRED,"DD/MM/YYYY"):null,
          hapus:res.data.FLAG_HAPUS === 'BOLEH DIHAPUS'?true:false
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

  useEffect(()=>{
    if(dataHead.kode && file){
      setDataHead((prev) => ({ ...prev, namafile: setDataHead((prev) => ({ ...prev, namafile: dataHead.kode+'.'+file.name.split('.').pop() }))}));
    }
  },[dataHead.kode,file])



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

  const ClearAll = () =>{
    setDataHead(defaultDataHead)
    setErrorHead(defaultError)
    setDataDetail([])
    setErrorDetail([])
  }

  const procBack = () =>{
    history.push("/portofolio");
  }

  const handleSelect = (event, key) => {
    if (key === "status") {
      const st = event.target.value;
      if(edit){
      setDataHead((prev) => ({
        ...prev,
        [key]: st
       
        
      }))
      }else{
        setDataHead((prev) => ({
          ...prev,
          [key]: st,
          publish: null,
          retired: null,
          
        }))
      };
    } else if (key === "publish" || key === "retired") {
      setDataHead((prev) => ({ ...prev, [key]: event }));
      

      if (key === "retired" && dataDetail.length>0){
      setDataDetail([...dataDetail].map(obj=>({...obj,retireddetail:event,status:"D"})))

      }
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

  const handleHapusDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = (newValue) => {
    setOpenDialog(false);

    if (newValue) {
      hapus()
    }
  };



  const handleChangeTF = (event, key) => {
    setDataHead((prev) => ({ ...prev, [key]: event.target.value }));
  };

  const handleFile = (e) => {
    if (e.target.files[0].name.length<30) {

      setFile(e.target.files[0]);
      
      console.log(e.target.files[0]);
    }else{
      setFile("");
      
      e.target.value = ""
    }
  };

  const handleViewFile=()=>{
    if(dataHead.namafile){
    downloadFile({filename:dataHead.namafile})
    .then(res=>  
      {const file = new Blob([res.data], { type: 'image/'+dataHead.namafile.split('.').pop()});
    //Build a URL from the file
    const fileURL = URL.createObjectURL(file);
    //Open the URL on new Window
     const pdfWindow = window.open();
     pdfWindow.location.href = fileURL;    
    })
    .catch((error) => {
      console.log(error);
    });
   
    //saveAs('image_url', 'image.jpg') 
  }else{
    
    setAlertDialog({
      openAlertDialog: true,
      messageAlertDialog: "file belum disimpan",
      severity: "error",
    })
    
  }
}

  const  handleSubmit = () => {
    if (file) {
      const ext = file.name.split('.').pop();
      const formData = new FormData();
      formData.append("file", file, dataHead.kode+'.'+ext);

      uploadFile(formData)
        .then((res) =>
          setAlertDialog({
            openAlertDialog: true,
            messageAlertDialog: res.data.message,
            severity: res.status === 200 ? "info" : "error",
          })
        )
       
        
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
console.log(value);
    //const val = value.target.value;

    let newArray = [...dataDetail];

    if (key === "item") {
      newArray[index] = {
        ...newArray[index],
        [key]: value.target.value.replace(/[^\d]/g, ""),
      };

      setDataDetail(newArray);
    } else if (key === "nama") {
      newArray[index] = { ...newArray[index], [key]: value.target.value };
      setDataDetail(newArray);
    }else if(key === "status"){
     
      newArray[index] = { ...newArray[index], [key]: value.target.value };
      setDataDetail(newArray);
    } else if (key === "keterangan" && validateLength255(value.target.value)) {
      newArray[index] = { ...newArray[index], [key]: value.target.value };
      setDataDetail(newArray);
    }else if(key==="publishdetail" || key==="retireddetail"){
      newArray[index] = { ...newArray[index], [key]: value };
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
          publishdetail:dataDetail[i].status === "AKTIF"
            ?dataDetail[i].publishdetail
              ? noErr
              :err
            : noErr,
          retireddetail:dataDetail[i].status === "TIDAK AKTIF"
            ?dataDetail[i].retireddetail
              ? noErr
              :err
            : noErr, 
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
      (dataHead.status !== 'PIPELINE'? dataDetail.length>0?
      dataDetail.every(
        (dt) => dt.item && dt.nama && dt.keterangan && dt.status && dt.status==="A"? dt.publishdetail : dt.retireddetail
      ):false:true) &&
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

  const hapus=()=>{
    setLoadingButton(true);
    deletePorto({id:dataHead.idporto})
    .then((response) => {
      console.log(response);
      setAlertDialog({
        openAlertDialog: true,
        messageAlertDialog: response.data.message,
        severity: "success",
      });
      setLoadingButton(false);
      setTimeout(() => {
        history.push("/portofolio");
      }, 1000);
    })
    //.then(history.push("/portofolio"))
    .catch((error) => {
      setLoadingButton(false);
      if (error.response)
        setAlertDialog({
          openAlertDialog: true,
          messageAlertDialog: error.response.data.message,
          severity: "error",
        });
  })
}

  const simpan = () => {
    setLoadingButton(true);
    // if(dataHead.status !== 'PIPELINE'){
    //   if(dataDetail.length>0){
      console.log(dataDetail);
      if (validateAll()) {
        const listdetail = dataDetail.map((dt) => ({
          item: dt.item,
          nama: dt.nama,
          // idrole : dt.role.id,
          keterangan: dt.keterangan,
          status: dt.status,
          tglitempublish:dt.publishdetail ? moment(dt.publishdetail).format("DD/MM/YYYY")
          : null,
          tglitemretired:dt.retireddetail ? moment(dt.retireddetail).format("DD/MM/YYYY")
          : null
        }));
        console.log(dataHead);
        const formatData = {
          ...dataHead,
          namafile:file?dataHead.kode+'.'+file.name.split('.').pop():"",
          publish: dataHead.publish
            ? moment(dataHead.publish).format("DD/MM/YYYY")
            : null,
          retired: dataHead.retired
            ? moment(dataHead.retired).format("DD/MM/YYYY")
            : null,
          listdetail: listdetail,
        };

        if (edit) {
          handleSubmit()
          setTimeout(() => {
            
          }, 500);
          updatePorto(formatData)
            .then((response) => {
              //setData(formatNewData(response.data.LISTDETAIL));
              setAlertDialog({ openAlertDialog: true, messageAlertDialog: "Berhasil ubah", severity: "success" });
              setLoadingButton(false);
              setTimeout(() => {
                history.push("/portofolio");
              }, 1000);
            })
            .catch((error) => {
              setLoadingButton(false);
              if (error.response)
                setAlertDialog({ openAlertDialog: true, messageAlertDialog: error.response.data.message, severity: "error" });
              else
                setAlertDialog({ openAlertDialog: true, messageAlertDialog: error.message, severity: "error" });
            });
        } else {
         
             handleSubmit()
         
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
              setTimeout(() => {
                history.push("/portofolio");
              }, 1000);
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
         
          messageAlertDialog: "Data belum lengkap, Silahkan periksa data yang anda masukkan.",
          severity: "warning",
        });
        setLoadingButton(false);
      }
    // }
    // else{
    //   setAlertDialog({
    //     openAlertDialog: true,
    //     messageAlertDialog: "Data Detail Tidak Boleh Kosong",
    //     severity: "warning",
    //   });
    //   setLoadingButton(false);
    // }
    
  };

  return (
    <Grid container direction="column" spacing={2}>
    
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
                      inputProps={{
                          maxLength: 50,
                        }}
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
                       inputProps={{
                          maxLength: 50,
                        }}
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
                       inputProps={{
                          maxLength: 150,
                        }}
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
                  <MenuItem value={"EX"}>External</MenuItem>
                
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
                  <TextField
                  variant="outlined"
                      className={classes.field}
                    inputProps={{ accept: "image/*" }}
                    //style={{display:'none'}}
                    id="contained-button-file"
                    name="file"
                    onChange={(e) => handleFile(e)}
                  
                    type="file"
                    helperText="file sebaiknya ukuran 2x5.72 cm"
                  />

                  
                </Grid>
                <Grid item xs>
                <Button
                style={{marginTop:10}}
                    variant="contained"
                    
                    onClick={handleViewFile}
                    color="primary"
                    startIcon={<VisibilityIcon />}
                    component="span"
                  >
                    View
                  </Button>
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
                      label="Tanggal Publish"
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
                      label="Tanggal Retired"
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
                <Grid item xs>
                  <Typography align="center" variant="body2">
                    <b>Item</b>
                  </Typography>
                </Grid>
                <Grid item xs>
                  <Typography align="center" variant="body2">
                    <b>Modul</b>
                  </Typography>
                </Grid>
                <Grid item xs>
                  <Typography align="center" variant="body2">
                    <b>Keterangan</b>
                  </Typography>
                </Grid>
                <Grid item xs>
                  <Typography align="center" variant="body2">
                    <b>Status</b>
                  </Typography>
                </Grid>
                <Grid item xs>
                  <Typography align="center" variant="body2">
                    <b>Tanggal Publish</b>
                  </Typography>
                </Grid>
                <Grid item xs>
                  <Typography align="center" variant="body2">
                    <b>Tanggal Non aktif</b>
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
                    <Grid key={"grid-publish-" + i} item xs>
                    <KeyboardDatePicker
                      key={"mulai-"}
                      id={"mulai-"}
                      name={"mulai-"}
                      fullWidth
                      clearable
                      format="DD/MM/YYYY"
                      size="small"
                      value={d.publishdetail||null}
                      // minDate={minDate ? moment(minDate, "DD/MM/YYYY") : moment("1900-01-01", "YYYY-MM-DD")}
                      onChange={(e) => handleChangeTFD(e,i, "publishdetail")}
                      // error={error[i].tanggalMulai.error}
                      // helperText={error[i].tanggalMulai.text}
                      // inputVariant={d.disabled ? "standard" : "outlined"}
                      views={["year", "month", "date"]}
                      disabled={
                        d.status === "A" ? false : true || true
                      }
                      // className={classes.field}
                      // error={errorHead.retired.error}
                      // helperText={errorHead.retired.text}
                    />
                    </Grid>
                    <Grid key={"grid-non-" + i} item xs>
                    <KeyboardDatePicker
                      key={"mulai-"}
                      id={"mulai-"}
                      name={"mulai-"}
                      fullWidth
                      clearable
                      format="DD/MM/YYYY"
                      size="small"
                      value={d.retireddetail||null}
                      // minDate={minDate ? moment(minDate, "DD/MM/YYYY") : moment("1900-01-01", "YYYY-MM-DD")}
                      onChange={(e) => handleChangeTFD(e,i, "retireddetail")}
                      // error={error[i].tanggalMulai.error}
                      // helperText={error[i].tanggalMulai.text}
                      // inputVariant={d.disabled ? "standard" : "outlined"}
                      views={["year", "month", "date"]}
                      disabled={
                        d.status === "D" ? false : true || true
                      }
                      // className={classes.field}
                      // error={errorHead.retired.error}
                      // helperText={errorHead.retired.text}
                    />
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
     
      {/* <Grid item xs container direction="row" justify="space-around" >
      <Grid item xs container justify="flex-end" >
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
      </Grid> */}
      
      <Grid item xs container direction="row" justify='space-between'>
<Grid item xs container justify="flex-start">
 <Button  onClick={loadingButton ? null : procBack} 
          variant="contained" 
          color="primary" >{"Back"}</Button>
          {edit?null:
            <Button  onClick={loadingButton ? null : ClearAll} 
          variant="contained" 
          color="secondary" style={{ marginLeft: 10 }} >{"Clear"}</Button>
          }
            </Grid>
        <Grid item xs container justify="flex-end">
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
          {dataHead && dataHead.hapus ? 
          <Button  onClick={loadingButton ? null : handleHapusDialog} 
          variant="contained" 
          color="secondary" style={{ marginLeft: 10 }} >{"hapus"}</Button>
            :null}
        </Grid>
      </Grid>
      
        <ConfirmationDialogRaw
          classes={{
            paper: classes.paper,
          }}
          id="ringtone-menu"
          keepMounted
          open={openDialog}
          onClose={handleCloseDialog}
          // value={valueDialog}
        />
    </Grid>
  );
}
