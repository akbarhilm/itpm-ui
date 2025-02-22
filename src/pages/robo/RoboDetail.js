import React, { useState, useEffect, useCallback, useContext } from 'react';
import { FormControl,Grid, Select,Typography,  TextField,  Paper, makeStyles,  Divider, InputLabel, MenuItem, RadioGroup, FormControlLabel, Radio } from '@material-ui/core';
import AlertDialog from '../../components/AlertDialog';
import { UserContext } from "../../utils/UserContext";
import { Autocomplete } from '@material-ui/lab';
import { KeyboardDatePicker } from '@material-ui/pickers';
import moment from 'moment';




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

const defaultAlert = { openAlertDialog: false, messageAlertDialog: "", severity: "info" };




// const defaultErrorDataTambahan = [
//   { code: "STORAGE", error: false, text: "" },
//   { code: "USER", error: false, text: "" },
//   { code: "SERVER", error: false, text: "" },
//   { code: "NETWORK", error: false, text: "" },
//   { code: "BACKUP", error: false, text: "" },
// ];




export default function RoboDetail(props) {
  const { robo,  karyawan, refe, risk, status } = props;
  const { user } = useContext(UserContext);

  const classes = useStyles();

  const [edit, setEdit] = useState(false);
  const [nomor, setNomor] = useState("");
  const [dataDetail, setDataDetail] = useState([]);
  const [dataRespPr, setDataRespPr] = useState([]);
  const [dataRespAt, setDataRespAt] = useState([]);
  const [dataRisk, setDataRisk] = useState(null)
  const [dataAct, setDataAct] = useState([]);
  const [dataBo, setDataBo] = useState([])
  const [dataMaster, setDataMaster] = useState([]);

  const [alertDialog, setAlertDialog] = useState(defaultAlert);

  const [dataRef, setDataRef] = useState(null);

  
  const validateLength500 = (value) => {
    if (value.length <= 500) return true;
    else return false;
  };

  const handleChangeText = (value, key) => {
    if (validateLength500(value)) {
      setDataMaster(prev => ({ ...prev, [key]: value }));
    }
  };

  const formatdataresp = useCallback((ref) => {
    const newData = []
    ref.refrole.forEach(d => {
      if (d.KODEACTOR === '0') {
        newData.push({ kodeactor: d.KODEACTOR, namaactor: d.NAMAACTOR, nik: user.NIK, nama: user.NAMA, ketrole: d.KETROLE.replace(/ *, */g, '\n'), idroleresp: d.IDROLERESP })
      }
    })
    return newData
  }, [user])

  const formatdatadetail = useCallback((detail) => {
    const newresppr = []
    const newrespat = []
    const newact = []
    const newbo = []

    detail.RESP.forEach(d => {
      if (d.KODEACTOR === '0') {
        newresppr.push(
          { kodeactor: d.KODEACTOR, namaactor: d.NAMAACTOR, nik: d.NIK, nama: karyawan ? karyawan.find(kar => kar.nik === d.NIK).nama : '', ketrole: d.KETROLE.replace(/ *, */g, '\n'), idroleresp: d.IDROLERESP }
        )
      }
      if (d.KODEACTOR !== '0') {
        newrespat.push(
          { kodeactor: d.KODEACTOR, namaactor: d.NAMAACTOR, nik: d.NIK, nama: karyawan ? karyawan.find(kar => kar.nik === d.NIK).nama : '', ketrole: d.KETROLE.replace(/ *, */g, '\n'), idroleresp: d.IDROLERESP }
        )
      }
    })
    detail.ACT.forEach(d => {
      newact.push(
        { idroact: d.IDROACT, namaact: d.NAMAACT, ketact: d.KETACT, namatj: d.NAMATJ, namapt: d.NAMAPT, tanggalMulai: moment(d.TGLMULAI,'DD/MM/YYYY'), tanggalSelesai: moment(d.TGLSELESAI,'DD/MM/YYYY')  }
      )
    })
    detail.BO.forEach(d => {
      newbo.push(
        { idboplan: d.IDBOPLAN, namatahap: d.NAMATAHAP, ketplan: d.KETPLAN.replace(/ *, */g, '\n'),kodehasil:d.KODEHASIL||'',kethasil:d.KETHASIL||'' }
      )
    })
    setDataRespPr(newresppr)
    setDataRespAt(newrespat)
    setDataAct(newact)
    setDataBo(newbo)
    const newdata = {}
    newdata.RESP = newresppr.concat(newrespat)
    newdata.ACT = newact
    newdata.BO = newbo
    return newdata
  }, [karyawan])

  const formatdataref = useCallback((ref) => {
    //const ref = refrole
    const newrole = []
    const newact = []
    const newbo = []
    console.log(ref)
    ref.refrole.forEach(d => {
      if (d.KODEACTOR !== '0') {
        newrole.push(
          { kodeactor: d.KODEACTOR, namaactor: d.NAMAACTOR, nik: user.NIK, nama: user.NAMA, ketrole: d.KETROLE.replace(/ *, */g, '\n'), idroleresp: d.IDROLERESP }
        )
      }
    })
    ref.refact.forEach(d => {
      newact.push(
        { idroact: d.IDROACT, namaact: d.NAMAACT, ketact: d.KETACT, namatj: d.NAMATJ, namapt: d.NAMAPT }
      )
    })
    ref.refbo.forEach(d => {
      newbo.push(
        { idboplan: d.IDBOPLAN, namatahap: d.NAMATAHAP, ketplan: d.KETPLAN.replace(/ *, */g, '\n') }
      )
    })


    const newData = {}
    newData.refrole = newrole
    newData.refact = newact
    newData.refbo = newbo
    return newData
  }, [user])



  const handleCloseAlertDialog = () => {
    setAlertDialog({ ...alertDialog, openAlertDialog: false });
  };

  


const formatdatamaster = useCallback((master)=>{
 const data = {...master}
 
const LISTDETAIL ={}
LISTDETAIL.RESP = []
LISTDETAIL.ACT = []
LISTDETAIL.BO = []
data.LISTDETAIL = LISTDETAIL



  return data
},[])

  useEffect(() => {

    if (isNaN(robo.NOROBO)) {
      setEdit(true);
      setDataRisk(risk.LISTDETAIL);
      setNomor(robo.NOROBO);
      setDataMaster(formatdatamaster(robo));
      setDataDetail(formatdatadetail(robo.LISTDETAIL));
      setDataRef(formatdataref(refe));


    }
    else {
      setDataRisk(risk.LISTDETAIL);
      setDataMaster(robo);
      // setDataDetail(robo.LISTDETAIL);
      setDataRef(formatdataref(refe));
      setDataRespPr(formatdataresp(refe));


    }
    

    //}, [robo, formatNewData]);
  }, [robo, formatdataref, risk, formatdataresp, formatdatamaster , refe, status, formatdatadetail]);


  const handleChangeDate = (value, index, jenis) => {
    console.log(index)
    let newArray = [...dataAct]

    if (jenis === "tanggalMulai") {
      newArray[index] = { ...newArray[index], [jenis]: value, tanggalSelesai: value < newArray[index].tanggalSelesai ? newArray[index].tanggalSelesai : null };
    } else {
      newArray[index] = { ...newArray[index], [jenis]: value };

    }
    setDataAct(newArray)

  };

  const handleChangehasil = (value, index, jenis) => {
    
    let newArray = [...dataBo]

   
      newArray[index] = { ...newArray[index], [jenis]: value.target.value };

    
    setDataBo(newArray)

  };

  const handleChange = (value, index, key) => {
console.log(dataDetail)
    if (key === "resppr") {
      let newArray = [...dataRespPr];
      //console.log(value.KETROLE)
      newArray[index] = { ...newArray[index], ketrole: value.ketrole, idroleresp: value.idroleresp };
      setDataRespPr(newArray);
    }
    if (key === "respat") {
      let newArray = [...dataRespAt];
      newArray[index] = {
        ...newArray[index],
        kodeactor: value.kodeactor, ketrole: value.ketrole,
        idroleresp: value.idroleresp,
        namaactor: value.namaactor
      };


      setDataRespAt(newArray);
      // console.log(newArray)
    }

    if (key === 'nik') {
      let newArray = [...dataRespAt];
      newArray[index] = {
        ...newArray[index],
        nik: value.nik,
        nama: value.nama
      };
      setDataRespAt(newArray);
    }

    if (key === 'act') {
      let newArray = [...dataAct];
      newArray[index] = {
        ...newArray[index],
        namaact: value.namaact,
        idroact: value.idroact, ketact: value.ketact,
        namatj: value.namatj, namapt: value.namapt,
      };
      setDataAct(newArray);
    }
    if (key === 'bo') {
      let newArray = [...dataBo];
      newArray[index] = {
        ...newArray[index],
        namatahap: value.namatahap,
        ketplan: value.ketplan,
        idboplan: value.idboplan
      

      };
      
      setDataBo(newArray);

    }

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
          {edit ? "Ubah Rollout Backout" : "Tambah Rollout Backout"}
        </Typography>
      </Grid>
      <Divider />
      <Grid item xs={6}>
        <TextField id="nomor"
          label="Nomor Rollout Backout"
          fullWidth
          disabled
          className={classes.fieldDisabled}
          value={nomor}
        />
      </Grid>
      <Grid item >
        <Paper className={classes.paper}>
          <Grid container direction="column" spacing={2}>
            <Grid item container spacing={1}>
              <Grid item xs>
                <Typography variant="h5">Roll Out</Typography>
                <Divider></Divider>
              </Grid>
              <Grid item container direction='row' alignItems='center'>
                <Grid item xs={4}>
                  <InputLabel>Jenis Layanan</InputLabel>
                </Grid>
                <RadioGroup row
                  //value={dataTambahan.find(d => d.code === 'NETWORK').deskripsi ? dataTambahan.find(d => d.code === 'NETWORK').deskripsi : null}
                  value={robo.JENISLAYANAN}

                  //onChange={(e) => handleChangeDataTambahan(e.target.value, 'NETWORK')}
                  style={{ marginLeft: '10px' }}
                  inputprops={{ readOnly: true }}
                >
                  <FormControlLabel value="BARU" control={<Radio />} label="Baru" />
                  <FormControlLabel value="PERUBAHAN" control={<Radio />} label="Perubahan" />
                  <FormControlLabel value="DARURAT" control={<Radio />} label="Darurat" />
                </RadioGroup>
              </Grid>

              {/* <Grid item container direction='row' alignItems='center'>
                <Grid item xs={4}>
                  <InputLabel>Kebutuhan lainnya</InputLabel>
                </Grid>
              </Grid> */}
            </Grid>

            <Grid item container spacing={1}>
              <Grid item container direction='row' alignItems='center'>
                <Grid item xs={4}>
                  <InputLabel>Penjelasan Layanan</InputLabel>
                </Grid>
                <Grid item xs={4}>
                  <TextField variant='outlined'
                    size='small'
                    fullWidth
                    multiline
                    disabled
                    rows={3}
                    value={dataMaster.KETLAYANAN}
                    onChange={(e) => handleChangeText(e.target.value, 'KETLAYANAN')}
                    style={{ marginLeft: '10px', marginTop: '10px' }}
                    className={classes.fieldDisabled}
                    
                  />
                </Grid>
              </Grid>
              <Grid item container direction='row' alignItems='center'>
                <Grid item xs={4}>
                  <InputLabel>Penjelasan Modul</InputLabel>
                </Grid>
                <Grid item xs={4}>
                  <TextField variant='outlined'
                    size='small'
                    fullWidth
                    multiline
                    disabled
                    rows={3}
                    value={dataMaster.KETMODUL}
                    onChange={(e) => handleChangeText(e.target.value, 'KETMODUL')}
                    style={{ marginLeft: '10px', marginTop: '10px' }}
                    className={classes.fieldDisabled}
                  // inputProps={{ style: { textAlign: 'right' } }}
                  />
                </Grid>
              </Grid>

              <Grid item container direction="row" justify="space-between">
                <Grid item xs>
                  <Typography variant="h6">Peran dan Tanggung Jawab</Typography>

                  <InputLabel style={{ marginTop: '10px' }}>Pimpinan Rollout</InputLabel>
                </Grid>
              </Grid>
              <Grid item container direction="column" spacing={1}>
                <Grid item container direction="row" spacing={1} justify="space-between">
                  <Grid item xs={1}>
                    <Typography align="center" variant="body2"><b>Jabatan</b></Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography align="center" variant="body2"><b>Nik/Nama</b></Typography>
                  </Grid>
                  <Grid item xs={7}>
                    <Typography align="center" variant="body2"><b>Peran & Tanggung Jawab</b></Typography>
                  </Grid>
                </Grid>
                {dataRespPr && dataRespPr.map((d, i) =>

                  <Grid item key={"grid-cont-" + i} container direction="row" spacing={1} justify="space-between" alignItems="center">

                    <Grid key={"grid-jabatan-" + i} item xs={2}>
                      <TextField id={"jabatan-" + i} name={"jabatan-" + i}
                        variant="outlined"
                        fullWidth
                        multiline
                        disabled
                        size="small"
                        value={d.namaactor}
                        className={classes.fieldDisabled}
                        

                      // onChange={(event) => handleChange(event.target.value, i, "kebutuhan")}
                      // required
                      // error={error[i].kebutuhan.error}
                      // helperText={error[i].kebutuhan.text}
                      />
                    </Grid>
                    <Grid item xs={3}>
                      <TextField id={"nama-" + i} name={"nama-" + i}
                        variant="outlined"
                        fullWidth
                        multiline
                        size="small"
                        value={d.nik + ` / ` + d.nama}
                        disabled
                        className={classes.fieldDisabled}
                      // value={d.rincian}
                      // onChange={(event) => handleChange(event.target.value, i, "rincian")}
                      // required
                      // error={error[i].rincian.error}
                      // helperText={error[i].rincian.text}
                      />
                    </Grid>
                    <Grid item xs={7}>
                      <TextField id={"peran-" + i} name={"peran-" + i}
                        variant="outlined"
                        fullWidth
                        size="small"
                        multiline
                        disabled
                        className={classes.fieldDisabled}
                        value={d.ketrole}
                      // onChange={(event) => handleChange(event.target.value, i, "useCase")}
                      // required
                      // error={error[i].useCase.error}
                      // helperText={error[i].useCase.text}
                      />

                      {/* <Autocomplete key={"resppr-" + i} id={"resppr-" + i} name={"resppr-" + i}
                        options={dataRef.refrole.filter((d) => d.kodeactor === '0')}
                        getOptionLabel={option => option.ketrole || ""}
                        onChange={(e, v) => handleChange(v, i, "resppr")}
                        //value={d.ketrole||""}
                        inputValue={d.ketrole}

                        //autoSelect={true}
                        getOptionSelected={

                          (option, value) => option.idroleresp === value.idroleresp
                        }
                        renderOption={(option) => (
                          <React.Fragment>
                            {option.ketrole}
                          </React.Fragment>
                        )}
                        renderInput={params => (
                          <TextField
                            {...params}
                            
                            fullWidth
                            variant={d.disabled ? "standard" : "outlined"}
                            size="small"
                          // error={error[i].resppr.error}
                          // helperText={error[i].resppr.text}
                          // className={d.disabled ? classes.fieldDisabled : null}
                          />
                        )}

                        disabled={d.disabled}
                      /> */}
                    </Grid>

                  </Grid>


                )}


              </Grid>


            </Grid>
            <Divider variant='middle' style={{ marginTop: '20px', marginBottom: '20px' }} />
            <Grid item>
              <InputLabel>Anggota Tim</InputLabel>
            </Grid>
            <Grid item container direction="column" spacing={1}>
              <Grid item container direction="row" spacing={1} justify="space-between">
                <Grid item xs={1}>
                  <Typography align="center" variant="body2"><b>Jabatan</b></Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography align="center" variant="body2"><b>Nik/Nama</b></Typography>
                </Grid>
                <Grid item xs={7}>
                  <Typography align="center" variant="body2"><b>Peran & Tanggung Jawab</b></Typography>
                </Grid>
                
              </Grid>
              {dataRespAt && dataRespAt.map((d, i) =>
                <Grid item key={"grid-cont-" + i} container direction="row" spacing={1} justify="space-between" alignItems="center">
                  <Grid key={"grid-jabatan-" + i} item xs={2}>
                    <Autocomplete key={"respat-" + i} id={"respat-" + i} name={"respat-" + i}
                      options={dataRef.refrole.filter((d) => d.kodeactor !== '0')}
                      getOptionLabel={option => option.namaactor || ""}
                      onChange={(e, v) => handleChange(v, i, "respat")}
                      //value={d.ketrole||""}
                      inputValue={d.namaactor}

                      //autoSelect={true}
                      getOptionSelected={

                        (option, value) => option.namaactor === value.namaactor
                      }
                      renderOption={(option) => (
                        <React.Fragment>
                          {option.namaactor}
                        </React.Fragment>
                      )}
                      renderInput={params => (
                        <TextField
                          {...params}
                          fullWidth
                          variant={d.disabled ? "standard" : "outlined"}
                          size="small"
                        // error={error[i].resppr.error}
                        // helperText={error[i].resppr.text}
                        // className={d.disabled ? classes.fieldDisabled : null}
                        />
                      )}
                      className={classes.fieldDisabled}
                      disabled
                    />
                  </Grid>
                  <Grid key={"grid-nik-" + i} item xs={3}>
                    <Autocomplete key={"nik-" + i} id={"nik-" + i} name={"nik-" + i}
                      options={karyawan || []}
                      getOptionLabel={option => option.nik + " / " + option.nama}
                      onChange={(e, v) => handleChange(v, i, 'nik')}
                      inputValue={d.nik + " / " + d.nama || ""}
                      //value={d.nik}
                      getOptionSelected={
                        (option, value) => option.nik === value.nik
                      }
                      renderOption={(option) => (
                        <React.Fragment>
                          {option.nik + " / " + option.nama + " / " + option.organisasi}
                        </React.Fragment>
                      )}
                      renderInput={params => (
                        <TextField
                          {...params}
                          fullWidth
                          variant={"outlined"}
                          size="small"
                        // error={error[i].error}
                        // helperText={error[i].text}
                        />
                      )}
                      className={classes.fieldDisabled}
                      disabled
                    />
                  </Grid>
                  <Grid key={"grid-role-" + i} item xs={7}>

                    <TextField key={"jabatan-" + i} id={"jabatan-" + i} name={"jabatan-" + i}
                      variant="outlined"
                      fullWidth
                      multiline
                      size="small"
                      disabled
                      className={classes.fieldDisabled}
                      value={d.ketrole}
                    //defaultValue={"12345 / asd asd"}
                    />
                  </Grid>
                  
                </Grid>
              )}
             
            </Grid>

            <Divider variant='middle' style={{ marginTop: '20px', marginBottom: '20px' }} />

            <Grid item container direction="row" justify="space-between">
              <Grid item xs>
                <Typography variant="h6">Jadwal & Aktivitas</Typography>
              </Grid>
            </Grid>
            <Grid item container direction="column" spacing={1}>
              <Grid item container direction="row" spacing={1} justify="space-between">
                <Grid item xs={2}>
                  <Typography align="center" variant="body2"><b>Aktivitas</b></Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography align="center" variant="body2"><b>Keterangan</b></Typography>
                </Grid>
                <Grid item xs={1}>
                  <Typography align="center" variant="body2"><b>Penanggung Jawab</b></Typography>
                </Grid>
                <Grid item xs={2}>
                  <Typography align="center" variant="body2"><b>Pihak Terilbat</b></Typography>
                </Grid>
                <Grid item lg={2}>
                  <Typography align="center" variant="body2"><b>Mulai</b></Typography>
                </Grid>
                <Grid item lg={2}>
                  <Typography align="center" variant="body2"><b>Selesai</b></Typography>
                </Grid>
                
              </Grid>
              {dataAct && dataAct.map((d, i) =>
                <Grid item key={"grid-cont-" + i} container direction="row" spacing={1} justify="space-between" alignItems="center">
                  <Grid key={"grid-aktivitas-" + i} item xs={2}>
                    <Autocomplete key={"act-" + i} id={"act-" + i} name={"act-" + i}
                      options={dataRef.refact}
                      getOptionLabel={option => option.namaact}
                      onChange={(e, v) => handleChange(v, i, "act")}
                      //value={d.namaact}
                      inputValue={d.namaact}

                      //autoSelect={true}
                      getOptionSelected={

                        (option, value) => option.idroact === value.idroact
                      }
                      renderOption={(option) => (
                        <React.Fragment>
                          {option.namaact}
                        </React.Fragment>
                      )}
                      renderInput={params => (
                        <TextField
                          {...params}
                          fullWidth
                          variant={d.disabled ? "standard" : "outlined"}
                          size="small"
                        // error={error[i].resppr.error}
                        // helperText={error[i].resppr.text}
                        // className={d.disabled ? classes.fieldDisabled : null}
                        />
                      )}
                      className={classes.fieldDisabled}
                      disabled
                    />
                  </Grid>
                  <Grid key={"grid-keterangan-" + i} item xs={3}>
                    <TextField key={"pic-" + i} id={"pic-" + i} name={"pic-" + i}
                      variant="outlined"
                      fullWidth
                      multiline
                      size="small"
                      value={d.ketact}
                      className={classes.fieldDisabled}
                      disabled
                    // onChange={(event) => handleChange(event.target.value, i, "jumlah")}
                    // required
                    // error={error[i].jumlah.error}
                    // helperText={error[i].jumlah.text}
                    // inputProps={{ style: { textAlign: 'right' } }}
                    />
                  </Grid>
                  <Grid key={"grid-pic-" + i} item xs={1}>
                    <TextField key={"pic-" + i} id={"pic-" + i} name={"pic-" + i}
                      variant="outlined"
                      fullWidth
                      multiline
                      size="small"
                      value={d.namatj}
                      className={classes.fieldDisabled}
                      disabled
                    // onChange={(event) => handleChange(event.target.value, i, "jumlah")}
                    // required
                    // error={error[i].jumlah.error}
                    // helperText={error[i].jumlah.text}
                    // inputProps={{ style: { textAlign: 'right' } }}
                    />
                  </Grid>
                  <Grid key={"grid-terilbat-" + i} item xs={2}>
                    <TextField key={"terilbat-" + i} id={"terilbat-" + i} name={"terilbat-" + i}
                      variant="outlined"
                      fullWidth
                      multiline
                      size="small"
                      value={d.namapt}
                      className={classes.fieldDisabled}
                      disabled
                    // onChange={(event) => handleChange(event.target.value, i, "jumlah")}
                    // required
                    // error={error[i].jumlah.error}
                    // helperText={error[i].jumlah.text}
                    // inputProps={{ style: { textAlign: 'right' } }}
                    />
                  </Grid>
                  <Grid key={"grid-mulai-" + i} item lg={2}>
                    <KeyboardDatePicker
                      fullWidth
                      multiline
                      clearable
                      id="tanggalMulai"
                      format="DD/MM/YYYY"
                      label="Tanggal Mulai"
                      value={d.tanggalMulai}
                      onChange={(value) => handleChangeDate(value, i, "tanggalMulai")}
                      required
                      // error={error.tanggalMulai.error}
                      // helperText={error.tanggalMulai.text}
                      inputVariant="outlined"
                      //className={classes.textField}
                      views={['year', 'month', 'date']}
                      disabled
                      className={classes.fieldDisabled}
                    />
                  </Grid>
                  <Grid key={"grid-selesai-" + i} item lg={2}>
                    <KeyboardDatePicker
                      fullWidth
                      multiline
                      clearable
                      id="tanggalSelesai"
                      format="DD/MM/YYYY"
                      label="Tanggal Selesai"
                      value={d.tanggalSelesai}
                      onChange={(value) => handleChangeDate(value, i, "tanggalSelesai")}
                      required
                      // error={error.tanggalMulai.error}
                      // helperText={error.tanggalMulai.text}
                      inputVariant="outlined"
                      className={classes.fieldDisabled}
                      views={['year', 'month', 'date']}
                      disabled
                    />
                  </Grid>
                  
                </Grid>
              )}
              
            </Grid>

            <Divider variant='middle' style={{ marginTop: '20px', marginBottom: '20px' }} />

            <Grid item container direction="row" justify="space-between">
              <Grid item xs>
                <Typography variant="h6">Risiko & Mitigas</Typography>
              </Grid>
            </Grid>
            <Grid item container direction="column" spacing={1}>
              <Grid item container direction="row" spacing={1} justify="space-between">
                <Grid item xs={6}>
                  <Typography align="center" variant="body2"><b>Risiko</b></Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography align="center" variant="body2"><b>Mitigasi</b></Typography>
                </Grid>
                {/* <Grid item xs={1}>
                  <Typography align="center" variant="body2"><b>Actions</b></Typography>
                </Grid> */}
              </Grid>
              {dataRisk && dataRisk.filter(f => f.IDPARENT)
                .sort((a, b) => a.IDPARENT < b.IDPARENT)
                .map((d, i) =>

                  <Grid item key={"grid-cont-" + i} container direction="row" spacing={1} justify="space-between" alignItems="center">
                    <Grid item xs={6}>
                      <TextField id={"risiko-" + i} name={"risiko-" + i}
                        variant="outlined"
                        fullWidth
                        multiline
                        size="small"
                        value={dataRisk.filter(f => f.IDRISK === d.IDPARENT)[0].NAMAFACTOR}
                      // onChange={(event) => handleChange(event.target.value, i, "kebutuhan")}
                      // required
                      // error={error[i].kebutuhan.error}
                      // helperText={error[i].kebutuhan.text}
                      className={classes.fieldDisabled}
                      disabled
                      />
                    </Grid>

                    <Grid item xs={6}>
                      <TextField id={"mitigasi-" + i} name={"mitigasi-" + i}
                        variant="outlined"
                        fullWidth
                        multiline
                        size="small"
                        value={d.NAMAFACTOR}
                        className={classes.fieldDisabled}
                        disabled
                      // onChange={(event) => handleChange(event.target.value, i, "rincian")}
                      // required
                      // error={error[i].rincian.error}
                      // helperText={error[i].rincian.text}
                      />
                    </Grid>
                    {/* <Grid  item xs={6}>
                    <TextField  id={"use-case-"} name={"use-case-"}
                      variant="outlined"
                      fullWidth
                      size="small"
                      multiline
                     
                      // value={d.useCase}
                      // onChange={(event) => handleChange(event.target.value, i, "useCase")}
                      // required
                      // error={error[i].useCase.error}
                      // helperText={error[i].useCase.text}
                    />
                  </Grid> */}
                  </Grid>
                )}

            </Grid>

          </Grid>
        </Paper>
      </Grid>


      <Grid item >
        <Paper className={classes.paper} >
          <Grid container direction="column" spacing={2}>
            <Grid item container spacing={1}>
              <Grid item xs>
                <Typography variant="h5">Back Out</Typography>
                <Divider></Divider>
              </Grid>


              {/* <Grid item container direction='row' alignItems='center'>
                <Grid item xs={4}>
                  <InputLabel>Kebutuhan lainnya</InputLabel>
                </Grid>
              </Grid> */}
            </Grid>

            <Grid item container spacing={1}>

              <Grid item container direction="column" spacing={1}>
                <Grid item container direction="row" spacing={1} justify="space-between">
                  <Grid item xs={2}>
                    <Typography align="center" variant="body2"><b>Tahapan</b></Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography align="center" variant="body2"><b>Backout Plan</b></Typography>
                  </Grid>
                  <Grid item xs={2}>
                    <Typography align="center" variant="body2"><b>Hasil</b></Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography align="center" variant="body2"><b>Keterangan</b></Typography>
                  </Grid>
                 
                </Grid>
                {dataBo && dataBo.map((d, i) =>
                  <Grid item key={"grid-cont-" + i} container direction="row" spacing={1} justify="space-between" alignItems="center">
                    <Grid key={"grid-tahapan-" + i} item xs={2}>
                      <Autocomplete key={"tahapan-" + i} id={"tahapanv-" + i} name={"tahapan-" + i}
                        options={dataRef.refbo}
                        getOptionLabel={option => option.namatahap}
                        onChange={(e, v) => handleChange(v, i, "bo")}
                        //value={d.namaact}
                        inputValue={d.namatahap}

                        //autoSelect={true}
                        getOptionSelected={

                          (option, value) => option.namatahap === value.namatahap
                        }
                        renderOption={(option) => (
                          <React.Fragment>
                            {option.namatahap}
                          </React.Fragment>
                        )}
                        renderInput={params => (
                          <TextField
                            {...params}
                            fullWidth
                            variant={d.disabled ? "standard" : "outlined"}
                            size="small"
                          // error={error[i].resppr.error}
                          // helperText={error[i].resppr.text}
                          // className={d.disabled ? classes.fieldDisabled : null}
                          />
                        )}
                        className={classes.fieldDisabled}
                        disabled
                      />
                    </Grid>
                    <Grid key={"grid-backout-" + i} item xs={4}>
                      <TextField key={"backout-" + i} id={"backout-" + i} name={"satuanx-" + i}
                        variant="outlined"
                        fullWidth
                        multiline
                        size="small"
                        value={d.ketplan}
                        disabled
                        className={classes.fieldDisabled}
                      // onChange={(event) => handleChange(event.target.value, i, "satuan")}
                      // required
                      // error={error[i].satuan.error}
                      // helperText={error[i].satuan.text}
                      />
                    </Grid>
                    <Grid key={"grid-hasil-" + i} item xs={2}>
                      {/* <TextField key={"hasil-" + i} id={"hasil-" + i} name={"jumlahx-" + i}
                        variant="outlined"
                        fullWidth
                        size="small"
                      //value={d.jumlah}
                      // onChange={(event) => handleChange(event.target.value, i, "jumlah")}
                      // required
                      // error={error[i].jumlah.error}
                      // helperText={error[i].jumlah.text}
                      // inputProps={{ style: { textAlign: 'right' } }}
                      /> */}
                      <FormControl variant="outlined" fullWidth>
                      <Select
                        labelId="kodehasil"
                        id="kodehasil"
                        value={d.kodehasil}
                        //label="Age"
                        onChange={(value) => handleChangehasil(value, i, "kodehasil")}
                        disabled
                        className={classes.fieldDisabled}
                        
                      >
                        
                        <MenuItem value={"sukses"}>Suskes</MenuItem>
                        <MenuItem value={"gagal"}>Gagal</MenuItem>
                        
                      </Select>
                      </FormControl>
                    </Grid>
                    <Grid key={"grid-keterangan-" + i} item xs={4}>
                      <TextField key={"keterangan-" + i} id={"keterangan-" + i} name={"keterangan-" + i}
                        variant="outlined"
                        fullWidth
                        size="small"
                       value={d.kethasil}
                       onChange={(value) => handleChangehasil(value, i, "kethasil")}
                       disabled
                       className={classes.fieldDisabled}
                      // required
                      // error={error[i].jumlah.error}
                      // helperText={error[i].jumlah.text}
                      // inputProps={{ style: { textAlign: 'right' } }}
                      />
                    </Grid>
                   
                  </Grid>
                )}
                
              </Grid>
            </Grid>
          </Grid>
        </Paper>

      </Grid>
      <Divider />
      
    </Grid>
  );
};
