import React, { useState, useEffect, useContext } from "react";
import {
  Grid, Typography, Divider,
  CircularProgress, 
  Accordion, AccordionSummary, AccordionDetails, 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,TableFooter
} from "@material-ui/core";
import { ExpandMore } from '@material-ui/icons';
import { getSummaryBy } from '../../gateways/api/ProyekAPI';
import AlertDialog from '../../components/AlertDialog';
import { UserContext } from "../../utils/UserContext";


// import moment from "moment";





const defaultAlert = { openAlertDialog: false, messageAlertDialog: "", severity: "info" };


export default function Summary(props) {
   //const { kar} = props;
  const { karyawan } = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const [alertDialog, setAlertDialog] = useState(defaultAlert);
  const [expanded, setExpanded] = useState(false);
  const [summaryByPm, setSummaryByPm] = useState();
  const [summaryByDev, setSummaryByDev] = useState();
  const [summaryByCat, setSummaryByCat] = useState();
  const [summaryByYear, setSummaryByYear] = useState();
  //const [kar,setKar] = useState();


  


  const handleCloseAlertDialog = () => {
    setAlertDialog({ ...alertDialog, openAlertDialog: false });
  };

  useEffect(() => {
   // console.log(kar)
    getSummaryBy()
      .then((response) => {
        const result = response.data
        
        setSummaryByPm(result.pm);
        setSummaryByDev(result.dev);
        setSummaryByCat(result.cat);
        setSummaryByYear(result.year);
        setLoading(false)
      })
      .catch((error) => {
        if (error.response)
          setAlertDialog({ openAlertDialog: true, messageAlertDialog: error.response.data.message, severity: "error" });
        else
          setAlertDialog({ openAlertDialog: true, messageAlertDialog: error.message, severity: "error" });
      });
      //console.log(summaryByPm)
  }, []);


const sumbaru = (item) =>{
  return  item.map(({BARU})=>BARU).reduce((sum,i)=>sum+i,0);
  
}
const sumberjalan = (item) =>{
  return item.map(({BERJALAN})=>BERJALAN).reduce((sum,i)=>sum+i,0);
}
const sumpending = (item)=>{
  return  item.map(({PENDING})=>PENDING).reduce((sum,i)=>sum+i,0);
}
const sumselesai=(item)=>{
  return  item.map(({SELESAI})=>SELESAI).reduce((sum,i)=>sum+i,0);
}
const sumtotal = (item)=>{
  return  item.map(({TOTAL})=>TOTAL).reduce((sum,i)=>sum+i,0);
}

  const handleChangeExpand = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };


  return (
    <Grid container direction="column" spacing={3}>
      <AlertDialog open={alertDialog.openAlertDialog}
        id="alert-dialog"
        onClose={handleCloseAlertDialog}
        message={alertDialog.messageAlertDialog}
        severity={alertDialog.severity}
      />

      <Grid item xs container direction="column" >
        <Grid item xs>
          {loading ? <Grid container justifyContent="center"><CircularProgress /></Grid>
            :
            <Grid item xs>
            <Accordion expanded={expanded === 'panel1'} onChange={handleChangeExpand('panel1')}>
              <AccordionSummary
                expandIcon={<ExpandMore />}
                aria-controls={"panel1-content"}
                id={"panel1-header"}
              >
                {/* <Avatar key={"avatar-" + i} alt={d.NAMAPROYEK ? d.NAMAPROYEK.toUpperCase() : "N"} src="#" /> */}
                <Grid container alignItems="center" justifyContent="space-between" >
                  <Typography style={{fontWeight:"bolder"}}>
                    Summary By PM
                  </Typography>
                </Grid>
              </AccordionSummary>
              <AccordionDetails key={"accord-dtl-1"}>
                <Grid container direction="column" spacing={2}>
                  <Grid item xs container justifyContent="center">
                    {/* <Card style={{ width: '75%' }}> */}

                    <TableContainer component={Paper}>
                      <Table aria-label="simple table">
                        <TableHead>
                          <TableRow>
                            <TableCell align="center" style={{fontWeight:"bold",backgroundColor:"ButtonHighlight"}}>Nama PM</TableCell>
                            <TableCell align="center" style={{fontWeight:"bold",backgroundColor:"ButtonHighlight"}}>ITPM Baru</TableCell>
                            <TableCell align="center" style={{fontWeight:"bold",backgroundColor:"ButtonHighlight"}}>ITPM Berjalan</TableCell>
                            <TableCell align="center" style={{fontWeight:"bold",backgroundColor:"ButtonHighlight"}}>ITPM Pending</TableCell>
                            <TableCell align="center" style={{fontWeight:"bold",backgroundColor:"ButtonHighlight"}}>ITPM Selesai</TableCell>
                            <TableCell align="center" style={{fontWeight:"bold",backgroundColor:"ButtonHighlight"}}>ITPM Total</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {summaryByPm?summaryByPm.map((row) => (
                            <TableRow key={row.NIKPM}>
                              <TableCell component="th" scope="row" align="center">
                                {row.NIKPM+" - "+karyawan.find(k=>k.nik===row.NIKPM).nama}
                              </TableCell>
                              <TableCell align="center">{row.BARU}</TableCell>
                              <TableCell align="center">{row.BERJALAN}</TableCell>
                              <TableCell align="center">{row.PENDING}</TableCell>
                              <TableCell align="center">{row.SELESAI}</TableCell>
                              <TableCell align="center">{row.TOTAL}</TableCell>
                            </TableRow>
                          )):<TableRow><TableCell>tidak ada data</TableCell></TableRow>}
                        </TableBody>
                        <TableFooter>
                          <TableRow>
                          <TableCell style={{backgroundColor:"ButtonHighlight"}}><Typography style={{fontWeight:"bold"}}>Total Keseluruhan</Typography> </TableCell>
                          <TableCell align="center" style={{backgroundColor:"ButtonHighlight"}}><Typography>{summaryByPm?sumbaru(summaryByPm):0}</Typography></TableCell>
                          <TableCell align="center" style={{backgroundColor:"ButtonHighlight"}}><Typography>{summaryByPm?sumberjalan(summaryByPm):0}</Typography></TableCell>
                          <TableCell align="center" style={{backgroundColor:"ButtonHighlight"}}><Typography>{summaryByPm?sumpending(summaryByPm):0}</Typography></TableCell>
                          <TableCell align="center" style={{backgroundColor:"ButtonHighlight"}}><Typography>{summaryByPm?sumselesai(summaryByPm):0}</Typography></TableCell>
                          <TableCell align="center" style={{backgroundColor:"ButtonHighlight"}}><Typography>{summaryByPm?sumtotal(summaryByPm):0}</Typography></TableCell>
                          </TableRow>
                        </TableFooter>
                      </Table>
                    </TableContainer>
                    {/* </Card> */}
                  </Grid>

                </Grid>
              </AccordionDetails>
            </Accordion>
            <Divider/>
            <Divider/>
          
            <Accordion expanded={expanded === 'panel2'} onChange={handleChangeExpand('panel2')}>
              <AccordionSummary
                expandIcon={<ExpandMore />}
                aria-controls={"panel2-content"}
                id={"panel2-header"}
              >
                {/* <Avatar key={"avatar-" + i} alt={d.NAMAPROYEK ? d.NAMAPROYEK.toUpperCase() : "N"} src="#" /> */}
                <Grid container alignItems="center" justifyContent="space-between" >
                  <Typography style={{fontWeight:"bolder"}}>
                    Summary By Dev
                  </Typography>
                </Grid>
              </AccordionSummary>
              <AccordionDetails key={"accord-dtl-2"}>
                <Grid container direction="column" spacing={2}>
                  <Grid item xs container justifyContent="center">
                    {/* <Card style={{ width: '75%' }}> */}

                    <TableContainer component={Paper}>
                      <Table aria-label="simple table">
                        <TableHead>
                          <TableRow>
                            <TableCell align="center" style={{fontWeight:"bold",backgroundColor:"ButtonHighlight"}}>Nama Dev</TableCell>
                            <TableCell align="center" style={{fontWeight:"bold",backgroundColor:"ButtonHighlight"}}>ITPM Baru</TableCell>
                            <TableCell align="center" style={{fontWeight:"bold",backgroundColor:"ButtonHighlight"}}>ITPM Berjalan</TableCell>
                            <TableCell align="center" style={{fontWeight:"bold",backgroundColor:"ButtonHighlight"}}>ITPM Pending</TableCell>
                            <TableCell align="center" style={{fontWeight:"bold",backgroundColor:"ButtonHighlight"}}>ITPM Selesai</TableCell>
                            <TableCell align="center" style={{fontWeight:"bold",backgroundColor:"ButtonHighlight"}}>ITPM Total</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {summaryByDev?summaryByDev.map((row) => (
                            <TableRow key={row.NIK}>
                              <TableCell component="th" scope="row" align="center">
                                {row.NIK+" - "+karyawan.find(k=>k.nik===row.NIK).nama}
                              </TableCell>
                              <TableCell align="center">{row.BARU}</TableCell>
                              <TableCell align="center">{row.BERJALAN}</TableCell>
                              <TableCell align="center">{row.PENDING}</TableCell>
                              <TableCell align="center">{row.SELESAI}</TableCell>
                              <TableCell align="center">{row.TOTAL}</TableCell>
                            </TableRow>
                          )):<TableRow><TableCell>tidak ada data</TableCell></TableRow>}
                        </TableBody>
                        <TableFooter>
                          <TableRow>
                          <TableCell style={{backgroundColor:"ButtonHighlight"}}><Typography style={{fontWeight:"bold"}}>Total Keseluruhan</Typography> </TableCell>
                          <TableCell align="center" style={{backgroundColor:"ButtonHighlight"}}><Typography>{summaryByDev?sumbaru(summaryByDev):0}</Typography></TableCell>
                          <TableCell align="center" style={{backgroundColor:"ButtonHighlight"}}><Typography>{summaryByDev?sumberjalan(summaryByDev):0}</Typography></TableCell>
                          <TableCell align="center" style={{backgroundColor:"ButtonHighlight"}}><Typography>{summaryByDev?sumpending(summaryByDev):0}</Typography></TableCell>
                          <TableCell align="center" style={{backgroundColor:"ButtonHighlight"}}><Typography>{summaryByDev?sumselesai(summaryByDev):0}</Typography></TableCell>
                          <TableCell align="center" style={{backgroundColor:"ButtonHighlight"}}><Typography>{summaryByDev?sumtotal(summaryByDev):0}</Typography></TableCell>
                          </TableRow>
                        </TableFooter>
                      </Table>
                    </TableContainer>
                    {/* </Card> */}
                  </Grid>

                </Grid>
              </AccordionDetails>
            </Accordion>

            <Divider/>
            <Divider/>


            <Accordion expanded={expanded === 'panel3'} onChange={handleChangeExpand('panel3')}>
              <AccordionSummary
                expandIcon={<ExpandMore />}
                aria-controls={"panel3-content"}
                id={"panel3-header"}
              >
                {/* <Avatar key={"avatar-" + i} alt={d.NAMAPROYEK ? d.NAMAPROYEK.toUpperCase() : "N"} src="#" /> */}
                <Grid container alignItems="center" justifyContent="space-between" >
                  <Typography style={{fontWeight:"bolder"}}>
                    Summary By Kategori
                  </Typography>
                </Grid>
              </AccordionSummary>
              <AccordionDetails key={"accord-dtl-3"}>
                <Grid container direction="column" spacing={2}>
                  <Grid item xs container justifyContent="center">
                    {/* <Card style={{ width: '75%' }}> */}

                    <TableContainer component={Paper}>
                      <Table aria-label="simple table">
                        <TableHead>
                          <TableRow>
                            <TableCell align="center" style={{fontWeight:"bold",backgroundColor:"ButtonHighlight"}}>Kategori</TableCell>
                            <TableCell align="center" style={{fontWeight:"bold",backgroundColor:"ButtonHighlight"}}>ITPM Baru</TableCell>
                            <TableCell align="center" style={{fontWeight:"bold",backgroundColor:"ButtonHighlight"}}>ITPM Berjalan</TableCell>
                            <TableCell align="center" style={{fontWeight:"bold",backgroundColor:"ButtonHighlight"}}>ITPM Pending</TableCell>
                            <TableCell align="center" style={{fontWeight:"bold",backgroundColor:"ButtonHighlight"}}>ITPM Selesai</TableCell>
                            <TableCell align="center" style={{fontWeight:"bold",backgroundColor:"ButtonHighlight"}}>ITPM Total</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {summaryByCat?summaryByCat.map((row) => (
                            <TableRow key={row.KATEGORI}>
                              <TableCell component="th" scope="row" align="center">
                                {row.KATEGORI}
                              </TableCell>
                              <TableCell align="center">{row.BARU}</TableCell>
                              <TableCell align="center">{row.BERJALAN}</TableCell>
                              <TableCell align="center">{row.PENDING}</TableCell>
                              <TableCell align="center">{row.SELESAI}</TableCell>
                              <TableCell align="center">{row.TOTAL}</TableCell>
                            </TableRow>
                          )):<TableRow><TableCell>tidak ada data</TableCell></TableRow>}
                        </TableBody>
                        <TableFooter>
                          <TableRow>
                          <TableCell style={{backgroundColor:"ButtonHighlight"}}><Typography style={{fontWeight:"bold"}}>Total Keseluruhan</Typography> </TableCell>
                          <TableCell align="center" style={{backgroundColor:"ButtonHighlight"}}><Typography>{summaryByCat?sumbaru(summaryByCat):0}</Typography></TableCell>
                          <TableCell align="center" style={{backgroundColor:"ButtonHighlight"}}><Typography>{summaryByCat?sumberjalan(summaryByCat):0}</Typography></TableCell>
                          <TableCell align="center" style={{backgroundColor:"ButtonHighlight"}}><Typography>{summaryByCat?sumpending(summaryByCat):0}</Typography></TableCell>
                          <TableCell align="center" style={{backgroundColor:"ButtonHighlight"}}><Typography>{summaryByCat?sumselesai(summaryByCat):0}</Typography></TableCell>
                          <TableCell align="center" style={{backgroundColor:"ButtonHighlight"}}><Typography>{summaryByCat?sumtotal(summaryByCat):0}</Typography></TableCell>
                          </TableRow>
                        </TableFooter>
                      </Table>
                    </TableContainer>
                    {/* </Card> */}
                  </Grid>

                </Grid>
              </AccordionDetails>
            </Accordion>
            <Divider/>
            <Divider/>



            <Accordion expanded={expanded === 'panel4'} onChange={handleChangeExpand('panel4')}>
              <AccordionSummary
                expandIcon={<ExpandMore />}
                aria-controls={"panel4-content"}
                id={"panel4-header"}
              >
                {/* <Avatar key={"avatar-" + i} alt={d.NAMAPROYEK ? d.NAMAPROYEK.toUpperCase() : "N"} src="#" /> */}
                <Grid container alignItems="center" justifyContent="space-between" >
                  <Typography style={{fontWeight:"bolder"}}>
                    Summary By Tahun
                  </Typography>
                </Grid>
              </AccordionSummary>
              <AccordionDetails key={"accord-dtl-4"}>
                <Grid container direction="column" spacing={2}>
                  <Grid item xs container justifyContent="center">
                    {/* <Card style={{ width: '75%' }}> */}

                    <TableContainer component={Paper}>
                      <Table aria-label="simple table">
                        <TableHead>
                          <TableRow>
                            <TableCell align="center" style={{fontWeight:"bold",backgroundColor:"ButtonHighlight"}}>Tahun</TableCell>
                            <TableCell align="center" style={{fontWeight:"bold",backgroundColor:"ButtonHighlight"}}>ITPM Baru</TableCell>
                            <TableCell align="center" style={{fontWeight:"bold",backgroundColor:"ButtonHighlight"}}>ITPM Berjalan</TableCell>
                            <TableCell align="center" style={{fontWeight:"bold",backgroundColor:"ButtonHighlight"}}>ITPM Pending</TableCell>
                            <TableCell align="center" style={{fontWeight:"bold",backgroundColor:"ButtonHighlight"}}>ITPM Selesai</TableCell>
                            <TableCell align="center" style={{fontWeight:"bold",backgroundColor:"ButtonHighlight"}}>ITPM Total</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {summaryByYear?summaryByYear.map((row) => (
                            <TableRow key={row.TAHUN}>
                              <TableCell component="th" scope="row" align="center">
                                {row.TAHUN}
                              </TableCell>
                              <TableCell align="center">{row.BARU}</TableCell>
                              <TableCell align="center">{row.BERJALAN}</TableCell>
                              <TableCell align="center">{row.PENDING}</TableCell>
                              <TableCell align="center">{row.SELESAI}</TableCell>
                              <TableCell align="center">{row.TOTAL}</TableCell>
                            </TableRow>
                          )):<TableRow><TableCell>tidak ada data</TableCell></TableRow>}
                        </TableBody>
                        <TableFooter>
                          <TableRow>
                          <TableCell style={{backgroundColor:"ButtonHighlight"}}><Typography style={{fontWeight:"bold"}}>Total Keseluruhan</Typography> </TableCell>
                          <TableCell align="center" style={{backgroundColor:"ButtonHighlight"}}><Typography>{summaryByYear?sumbaru(summaryByYear):0}</Typography></TableCell>
                          <TableCell align="center" style={{backgroundColor:"ButtonHighlight"}}><Typography>{summaryByYear?sumberjalan(summaryByYear):0}</Typography></TableCell>
                          <TableCell align="center" style={{backgroundColor:"ButtonHighlight"}}><Typography>{summaryByYear?sumpending(summaryByYear):0}</Typography></TableCell>
                          <TableCell align="center" style={{backgroundColor:"ButtonHighlight"}}><Typography>{summaryByYear?sumselesai(summaryByYear):0}</Typography></TableCell>
                          <TableCell align="center" style={{backgroundColor:"ButtonHighlight"}}><Typography>{summaryByYear?sumtotal(summaryByYear):0}</Typography></TableCell>
                          </TableRow>
                        </TableFooter>
                      </Table>
                    </TableContainer>
                    {/* </Card> */}
                  </Grid>

                </Grid>
              </AccordionDetails>
            </Accordion>
          </Grid>                
          }
        </Grid>


      </Grid>
    </Grid>
  );
}