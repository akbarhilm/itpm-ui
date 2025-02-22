import React,{useContext} from "react";
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
// import Charter from "../pages/charter/Charter";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import ResourceRouter from "../pages/resource/ResourceRouter";
import CharterRouter from "../pages/charter/CharterRouter";
import RisikoRouter from "../pages/risiko/RisikoRouter";
import UserRequirementRouter from "../pages/ureq/UserRequirementRouter";
import RencanaPelaksanaanRouter from "../pages/rencana/RencanaPelaksanaanRouter";
import RealisasiRouter from "../pages/realisasi/RealisasiRouter";
import UatRouter from "../pages/uat/UatRouter";
import BastRouter from "../pages/bast/BastRouter";
import RoboRouter from "../pages/robo/RoboRouter";
import Dashboard from '../pages/dashboard/Dashboard';
import Summary from '../pages/summary/Summary';
import Porto from '../pages/portofolio/Portofolio'
import TambahPorto from '../pages/portofolio/TambahPorto'
import Proker from '../pages/proker/Proker'
import Mpti from '../pages/mpti/Mpti'
import { UserContext } from '../utils/UserContext';

// import UatAdd from "../pages/uat/UatAdd";
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
  const { mpti } = useContext(UserContext);
  const classes = useStyles();

  return (
    <MuiPickersUtilsProvider utils={MomentUtils}>
      <div className={classes.div}>
        <Switch>
          <Route exact path='/401' >
            <Page401 />
          </Route>
          <PrivateRoute exact path='/portofolio' >
            <Porto setProyek={setProyek} setMenuSideBar={setMenuSideBar} />
          </PrivateRoute>
          <PrivateRoute exact path='/portofolio/tambah' >
            <TambahPorto/>
          </PrivateRoute>
          <PrivateRoute exact path='/portofolio/ubah' >
            <TambahPorto proyek={proyek}/>
          </PrivateRoute>
          <PrivateRoute exact path='/' >
            <Proyek setProyek={setProyek} setMenuSideBar={setMenuSideBar} />
          </PrivateRoute>
          <PrivateRoute exact path='/dashboard' >
            <Dashboard />
          </PrivateRoute>
          <PrivateRoute exact path='/summary' >
            <Summary/>
          </PrivateRoute>
         
          <PrivateRoute exact path='/mpti' >
            <Mpti/>
          </PrivateRoute>
          <PrivateRoute exact path='/proker' >
            <Proker mpti={mpti}/>
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
            <DetailProyek proyek={proyek} setProyek={setProyek} />
          </PrivateRoute>
          <PrivateRoute exact path='/:namauri/charter' >
            <CharterRouter proyek={proyek} />
          </PrivateRoute>
          <PrivateRoute exact path='/:namauri/ureq' >
            <UserRequirementRouter proyek={proyek} />
          </PrivateRoute>
          <PrivateRoute exact path='/:namauri/rencana' >
            <RencanaPelaksanaanRouter proyek={proyek} />
          </PrivateRoute>
          <PrivateRoute exact path='/:namauri/resource' >
            <ResourceRouter proyek={proyek} />
          </PrivateRoute>
          <PrivateRoute exact path='/:namauri/risiko' >
            <RisikoRouter proyek={proyek} />
          </PrivateRoute>
          <PrivateRoute exact path='/:namauri/realisasi' >
            <RealisasiRouter proyek={proyek} />
          </PrivateRoute>
          <PrivateRoute exact path='/:namauri/uat' >
            <UatRouter proyek={proyek} />
          </PrivateRoute>
          <PrivateRoute exact path='/:namauri/robo' >
            <RoboRouter proyek={proyek} />
          </PrivateRoute>
          <PrivateRoute exact path='/:namauri/bast' >
            <BastRouter proyek={proyek} />
          </PrivateRoute>
        </Switch>
      </div>
    </MuiPickersUtilsProvider>
  );
}
