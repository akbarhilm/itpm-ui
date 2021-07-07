import React, { useEffect } from 'react';
// import Cookies from 'universal-cookie';
import { useHistory } from 'react-router-dom';
import { CircularProgress } from '@material-ui/core';
import { getAuth } from '../utils/Auth';

export default function LandingPage() {
  // const cookies = new Cookies();
  const history = useHistory();
  // console.log("params =", params);
  // console.log("token =", params.get("token"));

  useEffect(() => {
    if (getAuth()) {
      // cookies.set('token', 'Bearer ' + params.get("token"));
      history.push("/");
      window.location.reload();
    }
  });

  return (
    <CircularProgress />
  );
}