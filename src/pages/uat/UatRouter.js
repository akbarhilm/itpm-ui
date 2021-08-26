import React, { useContext, useEffect, useState } from 'react';
import { CircularProgress } from '@material-ui/core';
import ErrorPage from '../../components/ErrorPage';
import { UserContext } from '../../utils/UserContext';
import { getUatByIdProyek } from '../../gateways/api/UatAPI';
import UatDetail from './UatDetail';
import Uat from './Uat';
import { getStepperProyekById } from '../../gateways/api/ProyekAPI';

export default function UatRouter(props) {
  const { proyek } = props;
  const { user } = useContext(UserContext);

  const [loading, setLoading] = useState(true);
  const [uat, setUat] = useState(null);
  const [status, setStatus] = useState(null);

  const otoritas = user.NIK === proyek.NIKREQ ? "BPO" : user.NIK === proyek.NIKPM ? "PM" : "PMO";
  // const otoritas = "PM";

  useEffect(() => {
    async function fetchData() {
      await getUatByIdProyek(proyek.IDPROYEK)
        .then((response) => {
          setUat(response.data);
        });
      await getStepperProyekById(proyek.IDPROYEK)
        .then((response) => {
          setStatus(response.data);
        });
      setLoading(false);
    }
    if (!uat) {
      setLoading(true);
      fetchData();
    }
  }, [uat, proyek]);

  if (loading)
    return <CircularProgress />;
  else if (otoritas === "PM" && uat && status && status.NOREAL)
    return <Uat uat={uat} proyek={proyek} />;
  else if (uat && Object.keys(uat).length === 0)
    return <ErrorPage code="" message={otoritas === "PM" ? "Realisasi belum diinput" : "UAT (User Acceptence Test) belum diinput"} />;
  else
    return <UatDetail uat={uat} proyek={proyek} />;

};