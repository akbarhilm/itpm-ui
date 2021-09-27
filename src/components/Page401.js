import React from "react";
// import { Typography, makeStyles } from "@material-ui/core";
import ErrorPage from "./ErrorPage";

// const useStyles = makeStyles((theme) => ({
//   container: {
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//     justifyContent: "center",
//     height: `100%`,
//     marginTop: theme.spacing(20),
//     marginBottom: theme.spacing(20),
//   },
//   login: {
//     marginTop: 20,
//   },
// }));

export default function Page401() {
  // const classes = useStyles();

  return (
    <ErrorPage code="401" message="Anda tidak berhak mengakses halaman ini" linkToLogin />
  );
}