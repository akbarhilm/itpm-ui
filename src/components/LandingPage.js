import React, { useEffect } from 'react';
// import Cookies from 'universal-cookie';
import { useHistory } from 'react-router-dom';
import { getAuthInfo } from '../gateways/api/AuthAPI';

export default function LandingPage() {
  const params = new URLSearchParams(window.location.search);
  // const cookies = new Cookies();
  const history = useHistory();
  // console.log("params =", params);
  console.log("token =", params.get("token"));

  useEffect(() => {
    if (params.get("token")) {
      // cookies.set('token', 'Bearer ' + params.get("token"));
      getAuthInfo(params.get("token"))
        .then((response) => {
          console.log(response);
          history.push("/proyek");
        });
    }
  });

  return (
    <>
      Please wait ...
    </>
  );
}