import React, { useState, useEffect, useContext } from "react";
import { Checkbox, FormControlLabel, FormControl, FormGroup, Grid, Typography, Divider, CircularProgress, TextField, InputAdornment, Card, CardActionArea, CardContent, Accordion, AccordionSummary, AccordionDetails, Stepper, Step, StepLabel, Chip, MenuItem, Button } from "@material-ui/core";
import { ExpandMore, Search } from '@material-ui/icons';
import Pagination from "@material-ui/lab/Pagination";
import { getListProyek, getSummaryProyek } from '../../gateways/api/ProyekAPI';
import { useCallback } from "react";
import AlertDialog from '../../components/AlertDialog';
import { UserContext } from "../../utils/UserContext";
import { labelStepper } from "../../utils/DataEnum";
import { Chart as ChartJS, CategoryScale, TimeScale, LinearScale, BarElement, Title, Tooltip, Legend, } from 'chart.js';
import 'chartjs-adapter-date-fns';
import { Bar } from 'react-chartjs-2';
import { groupBy } from "../../utils/Common";
import { Autocomplete, createFilterOptions } from "@material-ui/lab";
import * as FileSaver from 'file-saver'
import XLSX from 'sheetjs-style'
// import moment from "moment";

ChartJS.register(
  TimeScale,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);



const options = {
  indexAxis: 'y',
  elements: {
    bar: {
      borderWidth: 1,
    },
  },
  layout: {
    autoPadding: false,
    padding: 20,
  },
  responsive: true,
  plugins: {
    legend: {
      position: 'right',
    },
    tooltips: {
      callbacks: {
        afterBody: (context, data) => {
          console.log(context[0]);
          return '';
        }
      }
    }
  },
  scales: {
    x: {
      type: 'time',
      time: {
        unit: 'day',
        displayFormats: {
          day: 'dd MMM yyyy',
        },
      },
      min: '2022-07-31T00:00:00',
    },
  },
};

const datax = [
  { x: [new Date('2022-08-01T00:00:00'), new Date('2022-08-02T00:00:00')], y: 'kegiatan 1' },
  { x: [new Date('2022-08-03T00:00:00'), new Date('2022-08-05T00:00:00')], y: 'kegiatan 2' },
  { x: [new Date('2022-08-05T00:00:00'), new Date('2022-08-07T00:00:00')], y: 'kegiatan 3' },
  { x: [new Date('2022-08-06T00:00:00'), new Date('2022-08-10T00:00:00')], y: 'kegiatan 4' },
  { x: [new Date('2022-08-05T00:00:00'), new Date('2022-08-15T00:00:00')], y: 'kegiatan 5' },
];

const dataxx = [
  { x: [new Date('2022-08-01T00:00:00'), new Date('2022-08-03T00:00:00')], y: 'kegiatan 1' },
  { x: [new Date('2022-08-05T00:00:00'), new Date('2022-08-07T00:00:00')], y: 'kegiatan 2' },
  { x: [new Date('2022-08-05T00:00:00'), new Date('2022-08-07T00:00:00')], y: 'kegiatan 3' },
  { x: [new Date('2022-08-07T00:00:00'), new Date('2022-08-09T00:00:00')], y: 'kegiatan 4' },
  { x: [new Date('2022-08-11T00:00:00'), new Date('2022-08-15T00:00:00')], y: 'kegiatan 5' },
  { x: [new Date('2022-08-05T00:00:00'), new Date('2022-08-15T00:00:00')], y: 'kegiatan 6' },
  { x: [new Date('2022-08-05T00:00:00'), new Date('2022-08-15T00:00:00')], y: 'kegiatan 7' },
  { x: [new Date('2022-08-05T00:00:00'), new Date('2022-08-15T00:00:00')], y: 'kegiatan 8' },
  { x: [new Date('2022-08-05T00:00:00'), new Date('2022-08-15T00:00:00')], y: 'kegiatan 9' },
  { x: [new Date('2022-08-05T00:00:00'), new Date('2022-08-15T00:00:00')], y: 'kegiatan 10' },
];

const data = {
  datasets: [
    {
      label: 'Realisasi',
      data: dataxx.reverse(),
      borderColor: 'rgb(255, 99, 132)',
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
      barPercentage: 0.7,
      categoryPercentage: 0.2,
      tooltip: {
        callbacks: {
          label: (context) => {
            const tanggalMulai = context.raw.x[0].toLocaleString('id-ID', { day: "2-digit", month: "short", year: "numeric" });
            const tanggalSelesai = context.raw.x[1].toLocaleString('id-ID', { day: "2-digit", month: "short", year: "numeric" });
            return context.dataset.label + ": " + tanggalMulai + " - " + tanggalSelesai;
          }
        }
      },
    },
    {
      label: 'Rencana Pelaksanaan',
      data: datax.reverse(),
      borderColor: 'rgb(53, 162, 235)',
      backgroundColor: 'rgba(53, 162, 235, 0.5)',
      barPercentage: 0.7,
      categoryPercentage: 0.2,
      tooltip: {
        callbacks: {
          label: (context) => {
            const tanggalMulai = context.raw.x[0].toLocaleString('id-ID', { day: "2-digit", month: "short", year: "numeric" });
            const tanggalSelesai = context.raw.x[1].toLocaleString('id-ID', { day: "2-digit", month: "short", year: "numeric" });
            return context.dataset.label + ": " + tanggalMulai + " - " + tanggalSelesai;
          }
        }
      },
    },
  ],
};

const dataTotal = [
  { label: "TOTAL", value: 0, status: 'ALL' },
  { label: "SELESAI", value: 0, status: 'SELESAI' },
  { label: "BERJALAN", value: 0, status: 'BERJALAN' },
  { label: "PENDING", value: 0, status: 'PENDING' },
  { label: "BARU", value: 0, status: 'BARU' },
];

const listKategori = [
  {
    label: "Cari",
    value: "default"
  },
  {
    label: "Cari Berdasarkan NIK",
    value: "nik"
  },
];

const itemsPerPage = 10;

const defaultAlert = { openAlertDialog: false, messageAlertDialog: "", severity: "info" };

const filterOptions = createFilterOptions({
  matchFrom: 'any',
  stringify: (option) => option.nik + " - " + option.nama
});

export default function Dashboard(props) {
  // const { setProyek, setMenuSideBar } = props;
  const { user, kegiatan, karyawan } = useContext(UserContext);
  const isPermitted = ["BOD", "PMO", "QA"].some(x => user.OTORITAS.includes(x));
  // console.log(isPermitted);

  // const [refresh, setRefresh] = useState(Boolean(user));

  const [status, setStatus] = useState('ALL');
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(1);
  const [state, setState] = React.useState({
    SAP: true,
    NON_SAP: true
    
  });
  // const [filterproyek,setFilterproyek] = useState([])
  const [textSearch, setTextSearch] = useState("");
  const [listProyek, setListProyek] = useState([]);
  const [listProyekAfterSearch, setListProyekAfterSearch] = useState([]);
  // const [authPMO, setAuthPMO] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alertDialog, setAlertDialog] = useState(defaultAlert);
  const [expanded, setExpanded] = useState(false);
  const [summary, setSummary] = useState(dataTotal);
  const [kategori, setKategori] = useState("default");
  const [nik, setNik] = useState(null);

  const setStatusColor = (status, plan) => {
    // console.log(plan.map(p => new Date(p.tanggalSelesai)));
    // console.log(new Date(Math.max(...plan.map(p => new Date(p.tanggalSelesai)))));
    // return 'lightGreen';
    if (status === "BERJALAN" && plan.length > 0) {
      const today = new Date();
      const maxDate = new Date(Math.max(...plan.map(p => new Date(p.tanggalSelesai))));
      const fiveDayBeforeMaxDate = new Date(maxDate.getTime() - (5 * 24 * 60 * 60 * 1000));
      // const fiveDayBeforeMaxDate = maxDate.getDate();
      if (today < fiveDayBeforeMaxDate) return '#009944';
      else if (today < maxDate) return '#f0541e';
      else return '#cf000f';
      // console.log(today);
      // console.log(maxDate);
      // console.log(fiveDayBeforeMaxDate);
    }

    return null;
  };
  const { SAP, NON_SAP } = state;
  const handleCloseAlertDialog = () => {
    setAlertDialog({ ...alertDialog, openAlertDialog: false });
  };

  useEffect(() => {
    // console.log(user);
    getSummaryProyek()
      .then((response) => {
        const result = response.data[0];
        setSummary([
          { label: "TOTAL", value: result.TOTAL || 0, status: 'ALL' },
          { label: "SELESAI", value: result.SELESAI || 0, status: 'SELESAI' },
          { label: "BERJALAN", value: result.BERJALAN || 0, status: 'BERJALAN' },
          { label: "PENDING", value: result.PENDING || 0, status: 'PENDING' },
          { label: "BARU", value: result.BARU || 0, status: 'BARU' },
        ]);
      })
      .catch((error) => {
        if (error.response)
          setAlertDialog({ openAlertDialog: true, messageAlertDialog: error.response.data.message, severity: "error" });
        else
          setAlertDialog({ openAlertDialog: true, messageAlertDialog: error.message, severity: "error" });
      });
  }, []);

  useEffect(() => {
    setTotalPages(
      Math.ceil(listProyekAfterSearch.length / itemsPerPage)
    );
  }, [listProyekAfterSearch]);

  const getProyek = useCallback((stat, nik) => {
    const formatNewData = (listdetail) => {
      const grouped = groupBy(listdetail, x => x.IDKEGIATAN);
      const newData = [];
      grouped.forEach((value, key, map) => {
        const pelaksana = karyawan ? value.map(v => karyawan.filter(kar => kar.nik === v.NIKPELAKSANA).length > 0 ? karyawan.filter(kar => kar.nik === v.NIKPELAKSANA)[0].nik : v.NIKPELAKSANA) : [];
        const keg = kegiatan ? kegiatan.filter(keg => keg.IDKEGIATAN === key)[0] : null;
        newData.push({
          sort: keg ? keg.IDKEGIATAN : "",
          kegiatan: keg ? keg.NAMAKEGIATAN : "",
          pelaksana: pelaksana.toString(),
          tanggalMulai: value[0].TGLMULAI.split("/").reverse().join("-").concat("T08:00:00"),
          tanggalSelesai: value[0].TGLSELESAI.split("/").reverse().join("-").concat("T17:00:00"),
          target: keg ? keg.NAMATARGET : "",
        });
      });
      return newData.sort((a, b) => b.sort - a.sort);
    };

    const formatListProyek = (list) => {
      const newArray = [];
      list.forEach(d => {
        const plan = formatNewData(d.plan);
        const real = formatNewData(d.real);
        const dataOption = { ...options, scales: { ...options.scales, x: { ...options.scales.x, min: d.charter.length > 0 ? d.charter[0].TGLMULAI.split("/").reverse().join("-").concat("T00:00:00") : null } } };
        const dataGrafik = {
          datasets: [
            {
              ...data.datasets[0],
              data: plan.map(r => ({
                x: real.find(d => d.kegiatan === r.kegiatan)
                  ? [new Date(real.find(d => d.kegiatan === r.kegiatan).tanggalMulai), new Date(real.find(d => d.kegiatan === r.kegiatan).tanggalSelesai)]
                  : null,
                y: r.kegiatan
              }))
            },
            { ...data.datasets[1], data: plan.map(p => ({ x: [new Date(p.tanggalMulai), new Date(p.tanggalSelesai)], y: p.kegiatan })) },
          ]
        };
        newArray.push({ ...d, plan: plan, real: real, opt: dataOption, dataGrafik: dataGrafik });
      });
      return newArray;
    };
    // console.log(kegiatan);
    setLoading(true);
    getListProyek(stat, true, nik,state)
      .then((response) => {
        setListProyek(formatListProyek(response.data.list));
        setListProyekAfterSearch(formatListProyek(response.data.list));
        // setFilterproyek(formatListProyek(response.data.list))
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        if (error.response)
          setAlertDialog({ openAlertDialog: true, messageAlertDialog: error.response.data.message, severity: "error" });
        else
          setAlertDialog({ openAlertDialog: true, messageAlertDialog: error.message, severity: "error" });
      });
  }, [karyawan, kegiatan,state]);

  useEffect(() => {
    getProyek(status, nik);
  }, [getProyek, status, nik,state]);

  const handleChangePage = (event, value) => {
    setPage(value);
  };

  const handleChangeNik = (value) => {
    setNik(value ? value.nik : null);
    // setListProyekAfterSearch(listProyek);
    setStatus('ALL');
  };

  const handleChangeKategori = (event) => {
    setKategori(event.target.value);
    // setListProyekAfterSearch(listProyek);
    setStatus('ALL');
    setNik(null);
  };

  const handleChangeStatus = (stat) => () => {
    setStatus(stat);
    if (status !== stat) setTextSearch("");
  };

  const handleChangeSearch = (event) => {
    setTextSearch(event.target.value);
    setPage(1);
    // setDataSearch(event.target.value);
    
    setListProyekAfterSearch(listProyek.filter(d => d.NAMAPROYEK.toLowerCase().search(event.target.value.toLowerCase()) !== -1
      || d.NOLAYANAN.search(event.target.value.toLowerCase()) !== -1));
   
     
  };

  const handleChangeSAP = (event) => {
   
    setState({
      ...state,
      [event.target.name]: event.target.checked,
    });
    // if(event.target.checked){
    //   jenis.push(event.target.name)
     
    // }else{
    
    //   var index = jenis.indexOf(event.target.name);
    //   if (index > -1) {
    //     jenis.splice(index, 1);
    //  }
    // }
    
    //  setPage(1);
    
    
    //  setListProyekAfterSearch(listProyek.filter(d => jenis.indexOf(d.JENISPROJ)>-1))
    // setFilterproyek(listProyek.filter(d => jenis.indexOf(d.JENISPROJ)>-1))
  };

  const handleChangeExpand = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const completeStepper = (data, stepper) => {
    if (data === "Charter") return stepper.NOCHARTER;
    else if (data === "User Requirement") return stepper.NOUREQ;
    else if (data === "Rencana Pelaksanaan") return stepper.NOPLAN;
    else if (data === "Kebutuhan Resource") return stepper.NORES;
    else if (data === "Kajian Risiko") return stepper.NORISK;
    else if (data === "Realisasi") return stepper.NOREAL;
    else if (data === "UAT") return stepper.NOUAT;
    else if (data === "ROBO") return stepper.NOROBO;
    else if (data === "BAST") return stepper.NOBA;
    else return false;
  };

 
      
      
      const exportExcel = async()=>{
        const filename = 'dashboard'
        const dataproyek = listProyek.map(({dataGrafik,opt,stepper,charter,plan,real,...rest})=>rest)
        
        //const datacharter = listProyek.flatMap(d=>d.charter)
       
       // const dataplan = listProyek.flatMap(d=>d.plan)
        //const datareal = listProyek.flatMap(d=>d.real)
        const fileType = 'application/vnd.openxmlformats-officedocuments.spreadsheetml.sheet;charset=UTF-8';
        const fileExt = '.xlsx'
        const wsproyek = XLSX.utils.json_to_sheet(dataproyek);
        // const wscharter = XLSX.utils.json_to_sheet(datacharter);
        // const wsplan = XLSX.utils.json_to_sheet(dataplan);
        // const wsreal = XLSX.utils.json_to_sheet(datareal);
        const wb = XLSX.utils.book_new();
                  XLSX.utils.book_append_sheet(wb,wsproyek,'Proyek')
                  // XLSX.utils.book_append_sheet(wb,wscharter,'Charter')
                  // XLSX.utils.book_append_sheet(wb,wsplan,'Plan')
                  // XLSX.utils.book_append_sheet(wb,wsreal,'Real')
        //const wb = {Sheets:{'data':wsproyek},SheetNames:['proyek']}
        const excelbuffer = XLSX.write(wb,{bookType:'xlsx',type:'array'})
        const data = new Blob([excelbuffer],{type:fileType})
        FileSaver.saveAs(data,filename+fileExt);
      }
  

  return (
    <Grid container direction="column" spacing={3}>
      <AlertDialog open={alertDialog.openAlertDialog}
        id="alert-dialog"
        onClose={handleCloseAlertDialog}
        message={alertDialog.messageAlertDialog}
        severity={alertDialog.severity}
      />
      <Grid item xs container direction="row" justify="space-around">
        {summary.map((dt, i) => (
          <Card key={"card-" + i}>
            <CardActionArea key={"card-action-" + i} onClick={handleChangeStatus(dt.status)}>
              <CardContent key={"card-content-" + i}>
                <Typography key={"label-" + i} variant="h6" align="center">{dt.label}</Typography>
                <Typography key={"value-" + i} variant="h2" align="center">{dt.value}</Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        ))}
      </Grid>
      <Grid item xs container direction="column" >
        <Grid item xs container direction="row" alignItems="center">
          {isPermitted && <TextField
            variant="outlined"
            select
            size="small"
            margin="dense"
            value={kategori}
            onChange={handleChangeKategori}
            style={{ backgroundColor: 'lightblue' }}
          >
            {listKategori.map((d) => (
              <MenuItem key={"menu-likely-faktor-" + d.value} value={d.value}>
                {d.label}
              </MenuItem>
            ))}
          </TextField>}
          {kategori === "default" && <TextField
            type="search"
            variant="outlined"
            margin="dense"
            size="small"
            placeholder="Cari"
            value={textSearch ?? ""}
            onChange={handleChangeSearch}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search fontSize="small" />
                </InputAdornment>
              )
            }}
          />}
          {kategori === "nik" && <Autocomplete
            options={karyawan.filter(d => d.organisasi.search("IT") !== -1) || []}
            getOptionLabel={option => option.nik + " - " + option.nama}
            onChange={(e, v) => handleChangeNik(v)}
            getOptionSelected={
              (option, value) => option.nik === value.nik
            }
            style={{ width: '30%' }}
            renderOption={(option) => (
              option.nik + " - " + option.nama
            )}
            filterOptions={filterOptions}
            renderInput={params => (
              <TextField
                {...params}
                variant="outlined"
                size="small"
                margin="dense"
                placeholder="Nik/Nama Karyawan"
              />
            )}
          />}
          <FormControl component="fieldset">
            <FormGroup aria-label="position" row>
              <FormControlLabel
                value="start"
                control={<Checkbox checked={SAP} onChange={handleChangeSAP} name="SAP" />}
                label="SAP"
                labelPlacement="start"
              />
              <FormControlLabel
                value="start"
                control={<Checkbox checked={NON_SAP} onChange={handleChangeSAP} name="NON_SAP"/>}
                label="Non SAP"
                labelPlacement="start"
              />
              </FormGroup>
            </FormControl>
            </Grid>
            <Grid item xs>
              {loading ? <Grid container justify="center"><CircularProgress /></Grid>
                : listProyek.length > 0 ?
                  listProyekAfterSearch.slice((page - 1) * itemsPerPage, page * itemsPerPage)
                    .map((d, i) => (
                      <Accordion expanded={expanded === d.IDPROYEK} onChange={handleChangeExpand(d.IDPROYEK)} key={"accord-" + i}>
                        <AccordionSummary
                          key={"accord-sum-" + i}
                          expandIcon={<ExpandMore />}
                          aria-controls={"panel" + i + "-content"}
                          id={"panel" + i + "-header"}
                        >
                          {/* <Avatar key={"avatar-" + i} alt={d.NAMAPROYEK ? d.NAMAPROYEK.toUpperCase() : "N"} src="#" /> */}
                          <Grid container alignItems="center" justify="space-between" >
                            <Typography key={"no-layanan-" + i}>
                              {d.NOLAYANAN + " | " + d.NAMAPROYEK}
                            </Typography>
                            <Chip label={d.STATUSPROYEK} style={{ backgroundColor: setStatusColor(d.STATUSPROYEK, d.plan), color: d.STATUSPROYEK === 'BERJALAN' && d.plan.length > 0 ? 'white' : null }} />
                          </Grid>
                        </AccordionSummary>
                        <AccordionDetails key={"accord-dtl-" + i}>
                          <Grid container direction="column" spacing={2}>
                            <Grid item xs container justify="center">
                              <Card style={{ width: '75%' }}>
                                <Stepper alternativeLabel activeStep={-1}>
                                  {labelStepper
                                    .map((dStepper, index) => (
                                      <Step key={dStepper} completed={d.stepper ? completeStepper(dStepper, d.stepper) : false}>
                                        <StepLabel>{dStepper}</StepLabel>
                                      </Step>
                                    ))}
                                </Stepper>
                              </Card>
                            </Grid>
                            {
                              d.charter.length > 0 && d.plan.length > 0 &&
                              <Grid item xs container justify="center">
                                <Card style={{ width: '75%' }}>
                                  <Bar options={d.opt} data={d.dataGrafik} />
                                </Card>
                              </Grid>
                            }
                          </Grid>
                        </AccordionDetails>
                      </Accordion>))
                  : <><Divider style={{ marginTop: 8, marginBottom: 18 }} />
                    <Grid container justify="center">
                      <Typography>Tidak ada data.</Typography>
                    </Grid></>
              }
            </Grid>
            {totalPages > 0 && <Grid item xs container justify="center" style={{ marginTop: 10 }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={handleChangePage}
                defaultPage={1}
                color="primary"
                size="small"
              />
            </Grid>}
            <Grid item xs container justify="flex-end">
            <Button variant="contained" onClick={exportExcel} color="primary">Excel Export</Button>
            </Grid>
        </Grid>
      </Grid>
      );
}