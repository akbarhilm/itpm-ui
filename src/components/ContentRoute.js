import React from "react";
// import MUIContainer from "@material-ui/core/Container";
import MomentUtils from '@date-io/moment';
import { makeStyles } from "@material-ui/core";
import { Route, Switch } from "react-router-dom";
import Proyek from "../pages/proyek/Proyek";
import Page401 from "./Page401";
import DetailProyek from "../pages/proyek/DetailProyek";
import TambahProyek from "../pages/proyek/TambahProyek";
// import LandingPage from "./LandingPage";
import PrivateRoute from "./PrivateRoute";
import Charter from "../pages/charter/Charter";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import UserRequirement from "../pages/ureq/UserRequirement";
// import { MuiPickersUtilsProvider } from "@material-ui/pickers";
// import moment from 'moment';

const useStyles = makeStyles((theme) => ({
  container: {
    position: "relative",
    top: 85,
    marginBottom: 30,
  },
  div: {
    position: "relative",
    top: 30,
    // marginBottom: 30,
    padding: theme.spacing(5),
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
    <MuiPickersUtilsProvider utils={MomentUtils}>

      {/* // <MuiPickersUtilsProvider utils={MomentUtils}> */}
      {/* // <MUIContainer maxWidth="lg" className={classes.container}> */}
      <div className={classes.div}>
        {/* <Paper className={classes.paper}> */}
        <Switch>
          <Route exact path='/401' >
            <Page401 />
          </Route>
          <PrivateRoute exact path='/' >
            <Proyek setProyek={setProyek} setMenuSideBar={setMenuSideBar} />
          </PrivateRoute>
          <PrivateRoute exact path='/proyek' >
            <Proyek setProyek={setProyek} setMenuSideBar={setMenuSideBar} />
          </PrivateRoute>
          <PrivateRoute exact path='/proyek/tambah' >
            <TambahProyek />
          </PrivateRoute>
          <PrivateRoute exact path='/proyek/ubah' >
            <TambahProyek proyek={proyek} />
          </PrivateRoute>
          <PrivateRoute exact path='/:namauri' >
            <DetailProyek proyek={proyek} />
          </PrivateRoute>
          <PrivateRoute exact path='/:namauri/charter' >
            <Charter proyek={proyek} />
          </PrivateRoute>
          <PrivateRoute exact path='/:namauri/ureq' >
            <UserRequirement proyek={proyek} />
          </PrivateRoute>
        </Switch>
        {/* </Paper> */}
      </div>
      {/* // </MUIContainer> */}
      {/* // </MuiPickersUtilsProvider> */}
    </MuiPickersUtilsProvider>
  );
}
