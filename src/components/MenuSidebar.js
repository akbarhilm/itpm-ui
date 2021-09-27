import React from "react";
import clsx from "clsx";
import detailProyekIcon from '../assets/icons/icon-detail-proyek.svg'
import charterIcon from '../assets/icons/icon-charter.svg'
import rencanaPelaksanaIcon from '../assets/icons/icon-rencana-pelaksanaan.svg'
import userRequirementIcon from '../assets/icons/icon-user-requirement.svg'
import kajianRisikoIcon from '../assets/icons/icon-kajian-risiko.svg'
import kebutuhanResourceIcon from '../assets/icons/icon-kebutuhan-resource.svg'
import realisasiIcon from '../assets/icons/icon-realisasi.svg'
import uatIcon from '../assets/icons/icon-uat.svg'
import bastIcon from '../assets/icons/icon-bast.svg'

// Redux
// import { useSelector } from "react-redux";
// import { selectMenuSidebar } from "../../features/auth/Slice";
// import { selectProyek } from "../../features/proyek/Slice";

// Base Component
import Avatar from "@material-ui/core/Avatar";
import Divider from "@material-ui/core/Divider";
import MUIDrawer from "@material-ui/core/Drawer";
import MUIList from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Typography from "@material-ui/core/Typography";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";

// Custom Component
// import { List } from "../components/List";
import { makeStyles } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { useEffect } from "react";
import { getMenuSideBar } from "../gateways/api/CommonAPI";

// Style
const drawerWidth = 250;

const useStyles = makeStyles((theme) => ({
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap",
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: "hidden",
    width: theme.spacing(7) + 1,
  },
  proyekLogo: {
    marginLeft: -7,
  },
  empty: {
    display: "flex",
    alignItems: "center",
    margin: theme.spacing(-1, 1),
    ...theme.mixins.toolbar,
  },
  proyekTitle: {
    margin: theme.spacing(0, 2),
  },
  static: {
    "&:hover": { background: "white" },
    position: "fixed",
    backgroundColor: "white",
    width: drawerWidth,
    height: "40px",
    bottom: "0",
    // zIndex: "2",
    // left: -4
  },
  emptyListItem: {
    height: "50px",
    background: "white"
  },
  static2: {
    "&:hover": { background: "white" },
    position: "fixed",
    backgroundColor: "white",
    bottom: "0",
    width: theme.spacing(7) + 1,
    // zIndex: "2",
    height: "30px",
    // left: -2
  },
  iconSidebar: {
    width: "18px",
    height: "18px",
  },
}));

const arrayIcons = [
  {
    nama: "detail-proyek",
    icon: detailProyekIcon
  },
  {
    nama: "charter",
    icon: charterIcon
  },
  {
    nama: "rencana-pelaksanaan",
    icon: rencanaPelaksanaIcon
  },
  {
    nama: "user-requirement",
    icon: userRequirementIcon
  },
  {
    nama: "kajian-risiko",
    icon: kajianRisikoIcon
  },
  {
    nama: "kebutuhan-resource",
    icon: kebutuhanResourceIcon
  },
  {
    nama: "realisasi",
    icon: realisasiIcon
  },
  {
    nama: "uat",
    icon: uatIcon
  },
  {
    nama: "bast",
    icon: bastIcon
  },
]

export default function MenuSidebar(props) {
  const { proyek } = props;
  const history = useHistory();
  const classes = useStyles();
  const [drawer, setDrawer] = React.useState(false);
  const [menuSideBar, setMenuSideBar] = React.useState();

  useEffect(() => {
    if (proyek) {
      getMenuSideBar(proyek.IDPROYEK)
        .then((response) => {
          setMenuSideBar(response.data)
          // console.log("menu", response.data)
        })
    }
  }, [proyek])

  const handleDrawer = () => {
    setDrawer(!drawer);
  };

  const title = proyek && proyek.NAMAPROYEK ? proyek.NAMAPROYEK : "Nama Proyek";
  const size = 20 - (title.length - 13);

  const handleClickMenuSideBar = (link) => {
    const newLink = link ? ("/" + proyek.NAMAURI.concat(link)) : ("/" + proyek.NAMAURI)
    history.push(newLink);
    // console.log(newLink)
  }

  return (
    <>
      <MUIDrawer
        variant="permanent"
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: drawer,
          [classes.drawerClose]: !drawer,
        })}
        classes={{
          paper: clsx({
            [classes.drawerOpen]: drawer,
            [classes.drawerClose]: !drawer,
          }),
        }}
      >
        <div className={classes.empty} />
        <MUIList>
          <ListItem >
            <Avatar
              alt={title}
              src="/static/images/avatar/1.jpg"
              className={classes.proyekLogo}
            />
            <Typography
              className={classes.proyekTitle}
              variant="h6"
              style={{
                fontSize: size,
              }}
            >
              {title}
            </Typography>
          </ListItem>
        </MUIList>
        <Divider />
        <MUIList dense>
          {menuSideBar && menuSideBar.length > 0 &&
            menuSideBar.filter(d => d.KODESIDEBAR === "1").map((menu, index) => (
              <ListItem key={"list-item-" + index} button onClick={() => handleClickMenuSideBar(menu.NAMAURI)}>
                <ListItemIcon key={"list-item-icon-" + index}>
                  <img
                    key={"icon-" + index}
                    src={arrayIcons.find(icon => icon.nama === menu.NAMAMENU.toLowerCase().replace(" ", "-")).icon}
                    alt={menu.NAMAMENU}
                    className={classes.iconSidebar}
                  />
                </ListItemIcon>
                <ListItemText key={"list-item-text-" + index} primary={menu.NAMAMENU} />
              </ListItem>
            ))}
          <ListItem className={classes.emptyListItem} />
        </MUIList>
        <MUIList className={clsx({
          [classes.static]: drawer,
          [classes.static2]: !drawer,
        })}
        >
          <Divider />
          <ListItem button onClick={handleDrawer} >
            <ListItemIcon >
              {drawer ? <ChevronLeftIcon /> : <ChevronRightIcon />}
            </ListItemIcon>
            {drawer && <ListItemText primary={"Collapse Sidebar"} />}
          </ListItem>
        </MUIList>
      </MUIDrawer>
    </>
  );
}
