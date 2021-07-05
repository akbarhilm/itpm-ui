import React from "react";
import MUIContainer from "@material-ui/core/Container";
// import MomentUtils from '@date-io/moment';
import { makeStyles, Paper } from "@material-ui/core";
import { Route, Switch } from "react-router-dom";
import Proyek from "../pages/proyek/Proyek";
import Page401 from "./Page401";
import DetailProyek from "../pages/proyek/DetailProyek";
import TambahProyek from "../pages/proyek/TambahProyek";
import LandingPage from "./LandingPage";
// import PermohonanBantuan from "../pages/permohonan-bantuan/Index";
// import { MuiPickersUtilsProvider } from "@material-ui/pickers";
// import Home from "../pages/home/home";
// import moment from 'moment';

const useStyles = makeStyles((theme) => ({
  container: {
    position: "relative",
    top: 85,
    marginBottom: 30,
  },
  paper: {
    padding: theme.spacing(2),
    margin: "auto",
    maxWidth: "100%",
  },
}));

export default function Content(props) {
  const { auth, proyek, setProyek, setMenuSideBar } = props;
  const classes = useStyles();



  return (
    // <MuiPickersUtilsProvider utils={MomentUtils}>
    <MUIContainer maxWidth="lg" className={classes.container}>
      <Paper className={classes.paper}>
        <Switch>
          <Route exact path='/' >
            <LandingPage />
          </Route>
          <Route exact path='/proyek' >
            <Proyek auth={auth} setProyek={setProyek} setMenuSideBar={setMenuSideBar} />
          </Route>
          <Route exact path='/401' >
            <Page401 />
          </Route>
          <Route exact path='/proyek/tambah' >
            <TambahProyek />
          </Route>
          <Route exact path='/proyek/ubah' >
            <TambahProyek proyek={proyek} />
          </Route>
          <Route exact path='/:namauri' >
            <DetailProyek auth={auth} proyek={proyek} />
          </Route>
        </Switch>
      </Paper>
    </MUIContainer>
    // </MuiPickersUtilsProvider>
  );
}
