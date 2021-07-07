import React from "react";
import MUIContainer from "@material-ui/core/Container";
// import MomentUtils from '@date-io/moment';
import { makeStyles, Paper } from "@material-ui/core";
import { Route, Switch } from "react-router-dom";
import Proyek from "../pages/proyek/Proyek";
import Page401 from "./Page401";
import DetailProyek from "../pages/proyek/DetailProyek";
import TambahProyek from "../pages/proyek/TambahProyek";
// import LandingPage from "./LandingPage";
import PrivateRoute from "./PrivateRoute";
// import { MuiPickersUtilsProvider } from "@material-ui/pickers";
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
  const { proyek, setProyek, setMenuSideBar } = props;
  const classes = useStyles();



  return (
    // <MuiPickersUtilsProvider utils={MomentUtils}>
    <MUIContainer maxWidth="lg" className={classes.container}>
      <Paper className={classes.paper}>
        <Switch>
          <PrivateRoute exact path='/' >
            <Proyek setProyek={setProyek} setMenuSideBar={setMenuSideBar} />
          </PrivateRoute>
          <Route exact path='/proyek' >
            <Proyek setProyek={setProyek} setMenuSideBar={setMenuSideBar} />
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
            <DetailProyek proyek={proyek} />
          </Route>
        </Switch>
      </Paper>
    </MUIContainer>
    // </MuiPickersUtilsProvider>
  );
}
