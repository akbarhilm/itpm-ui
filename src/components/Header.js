import React, { useState, useContext } from "react";
import Cookies from "universal-cookie";

// Redux
// import { useDispatch, useSelector } from "react-redux";
// import { useSelector } from "react-redux";
// import {
//   selectPengguna,
//   selectMenuHeader,
//   // selectListAplikasi,
//   // logout,
// } from "../../features/auth/Slice";

// Router
// import { NavLink } from "react-router-dom";

// Base Component
import AppBar from "@material-ui/core/AppBar";
import Avatar from "@material-ui/core/Avatar";
import Box from "@material-ui/core/Box";
import Chip from "@material-ui/core/Chip";
// import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
// import IconButton from "@material-ui/core/IconButton";
import ListItemText from "@material-ui/core/ListItemText";
import MenuItem from "@material-ui/core/MenuItem";
import Popover from "@material-ui/core/Popover";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Menu from '@material-ui/core/Menu';
import MenuList from '@material-ui/core/MenuList';
// import AccountCircleIcon from "@material-ui/icons/AccountCircle";
// import AppsIcon from "@material-ui/icons/Apps";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";

// Custom Component
// import Button from "./Button";
import { makeStyles, ButtonBase } from "@material-ui/core";

import logoitpm from '../assets/image/logo_itpm.png';
import { useHistory } from "react-router-dom";
import { UserContext } from "../utils/UserContext";

// import { getUser } from "../gateways/api/CommonAPI";

const useStyles = makeStyles((theme) => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  formlogo: {
    fontSize: '100px',
    marginTop: 10,
    display: '-webkit-flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: theme.spacing(5),
    height: theme.spacing(5),
    objectFit: 'contain',
    margin: '0 auto',
    backgroundImage: `url(${logoitpm})`,
    backgroundRepeat: 'no-repeat',
  },
  title: {
    margin: theme.spacing(0.8, 1.5),
  },
  button: {
    color: "white",
    marginTop: 5,
  },
  menu: {
    marginLeft: 10,
  },
  navlink: {
    textDecoration: "none",
    color: "inherit",
  },
}));


export default function Header(props) {
  const { setProyek, setMenuSideBar } = props;
  const history = useHistory();
  const { user } = useContext(UserContext);
  const cookies = new Cookies();
  const classes = useStyles();
  // const [user, setUser] = useState();
  const [anchor, setAnchor] = useState({ menu: null, pengguna: null,ref:null});
  const popover = {
    menu: Boolean(anchor.menu),
    pengguna: Boolean(anchor.pengguna),
    ref:Boolean(anchor.ref)
  };

  // useEffect(() => {
  //   if (!user)
  //     getUser().then((response) => setUser(response.data));
  // }, [user]);
  // const [anchorEl, setAnchorEl] = React.useState(null);
  // const open = Boolean(anchorEl);

  // const handleClicksum = (event) => {
  //   setAnchorEl(event.currentTarget);
  // };
  const isPermitted = ["BOD", "PMO", "QA"].some(x => user.OTORITAS.includes(x));
  const permitRef = ["BOD","PMO"].some(x => user.OTORITAS.includes(x));
  const handleAnchor = (event) => {
    setAnchor((prevState) => ({
      ...prevState,
      [event.currentTarget.id]: event.currentTarget,
    }));
  };

  // const handleClosesum = () => {
  //   setAnchorEl(null);
  // };

  const handleClose = () => {
    setAnchor((prevState) => ({
      ...prevState,
      menu: null,
      pengguna: null,
      ref:null
      
    }));
  };

  const doLogout = () => {
    cookies.remove("auth", { path: "/", domain: process.env.REACT_APP_HOST });
    // cookies.remove("refresh", { path: "/", domain: process.env.REACT_APP_API_URL });
    // dispatch(logout());

    window.location.href = process.env.REACT_APP_HOST_LOGIN;
  };

  const handleLinkToProyek = () => {
    setProyek();
    setMenuSideBar(false);
    history.push("/proyek");
  };

  const handleLinkToDashboard = () => {
    setProyek();
    setMenuSideBar(false);
    history.push("/dashboard");
  };
  const handleLinkToSum= () => {
    setProyek();
    setMenuSideBar(false);
    history.push("/summary");
  };

  const handleLinkToPorto= () => {
    //setProyek();
   
    setMenuSideBar(false);
    history.push("/portofolio");
    handleClose()
  };

  const handleLinkToMPTI= () => {
    //setProyek();
    setMenuSideBar(false);
    history.push("/mpti");
    handleClose()
  };

  const handleLinkToProker= () => {
    //setProyek();
    setMenuSideBar(false);
    history.push("/proker");
    handleClose()
  };

  return (
    <>
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar variant="dense">
          <Grid container direction="row" justify="flex-start" alignItems="center" spacing={3}>
            <Grid item>
              <ButtonBase onClick={handleLinkToProyek}>
                <span className={classes.formlogo}>
                </span>
                <Typography variant="h5">
                  {"ITPM"}
                </Typography>
              </ButtonBase>
            </Grid>
            <Grid item xs container direction="row" spacing={3} alignItems="center" justify="flex-start">
              <Grid item>
                <ButtonBase onClick={handleLinkToDashboard}>
                  <Typography>
                    {"Dashboard"}
                  </Typography>
                </ButtonBase>
              </Grid>
              <Grid item>
                <ButtonBase onClick={handleLinkToProyek}>
                  <Typography>
                    {"Proyek"}
                  </Typography>
                </ButtonBase>
              </Grid>
              {isPermitted &&
              <Grid item>
                <ButtonBase onClick={handleLinkToSum}>
                  <Typography>
                    {"Summary"}
                  </Typography>
                </ButtonBase>
                   
              </Grid>
              } 
              {permitRef &&
              <Grid item>
                <ButtonBase onClick={handleAnchor} id="ref">
                  <Typography>
                    {"Referensi"}
                  </Typography>
                </ButtonBase>
                <Menu
        id="simple-menu"
        anchorEl={anchor.ref}
        keepMounted
        open={Boolean(anchor.ref)}
        onClose={handleClose}
        style={{marginTop:32}}
      >
       <MenuList>
        {user.OTORITAS.includes("BOD") && 
        <Box>
        <MenuItem onClick={handleLinkToMPTI}>MPTI</MenuItem>
        <MenuItem onClick={handleLinkToProker}>Proker</MenuItem>
        </Box>
        }
         {user.OTORITAS.includes("PMO") && 
        <Box>
        <MenuItem onClick={handleLinkToPorto}>Portofolio</MenuItem></Box>
       } 
        </MenuList>
      </Menu>
              </Grid>
              } 
            </Grid>
          </Grid>
          <Grid container justify="flex-end">
            <Grid item>
              <Box display="inline" marginLeft={1}>
                <Chip
                  avatar={
                    <Avatar
                      alt={user ? user.NAMA : "Nama Pengguna"}
                      src="#"
                    />
                  }
                  label={user ? user.NAMA : "Nama Pengguna"}
                  onClick={handleAnchor}
                  id="pengguna"
                />
                <Popover
                  open={popover.pengguna}
                  anchorReference="anchorPosition"
                  anchorPosition={{
                    top: 48,
                    left: window.innerWidth - 90,
                  }}
                  onClose={handleClose}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "center",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "center",
                  }}
                >
                  <MenuItem onClick={handleClose}>
                    <ExitToAppIcon fontSize="small" />
                    <ListItemText
                      primary="back to INFO"
                      className={classes.menu}
                      onClick={doLogout}
                    />
                  </MenuItem>
                </Popover>
              </Box>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
    </>
  );
}
