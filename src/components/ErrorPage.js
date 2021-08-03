import React from "react";
import { Typography, makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: `100%`,
    marginTop: theme.spacing(20),
    marginBottom: theme.spacing(20),
  },
  login: {
    marginTop: 20,
  },
}));

export default function ErrorPage(props) {
  const { code, message, linkToLogin } = props;
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <Typography variant="h4">{code}</Typography>
      <Typography variant="subtitle1">{message || "Anda Tidak Berhak Mengakses Halaman Ini"}</Typography>
      {linkToLogin && <a className={classes.login} href={process.env.REACT_APP_HOST_LOGIN}>Login</a>}
    </div>
  );
}