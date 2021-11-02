import React, { useContext, useEffect, useState } from 'react';
import { CircularProgress } from '@material-ui/core';
import ErrorPage from '../../components/ErrorPage';
import { UserContext } from '../../utils/UserContext';
import { getUatByIdProyek } from '../../gateways/api/UatAPI';
import Uat from './Uat';
import { getStepperProyekById } from '../../gateways/api/ProyekAPI';

export default function UatRouter(props) {
  const { proyek } = props;
  const { user, karyawan: cKaryawan } = useContext(UserContext);

  const [loading, setLoading] = useState(true);
  const [listUat, setListUat] = useState(null);
  const [status, setStatus] = useState(null);

  const otoritas = user.NIK === proyek.NIKREQ ? "BPO" : user.NIK === proyek.NIKPM ? "PM" : "PMO";
  // const otoritas = "PM";

  useEffect(() => {
    async function fetchData() {
      await getUatByIdProyek(proyek.IDPROYEK)
        .then((response) => {
          setListUat(response.data);
        });
      await getStepperProyekById(proyek.IDPROYEK)
        .then((response) => {
          setStatus(response.data);
        });
      setLoading(false);
    }
    if (!listUat) {
      setLoading(true);
      fetchData();
    }
  }, [listUat, proyek, cKaryawan]);

  if (loading)
    return <CircularProgress />;
  else if (otoritas === "PM" && status && status.NOREAL)
    return <Uat otoritas={otoritas} listUat={listUat} proyek={proyek} status={status} />;
  else if (listUat && listUat.length === 0)
    return <ErrorPage code="" message={otoritas === "PM" ? "Realisasi belum diinput" : "UAT (User Acceptence Test) belum diinput"} />;
  else
    return <Uat otoritas={otoritas} listUat={listUat} proyek={proyek} status={status} />;
};