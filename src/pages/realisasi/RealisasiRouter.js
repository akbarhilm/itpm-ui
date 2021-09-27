import React, { useContext, useEffect, useState } from 'react';
import { CircularProgress } from '@material-ui/core';
import ErrorPage from '../../components/ErrorPage';
import { UserContext } from '../../utils/UserContext';
import { getRealisasiByIdProyek } from '../../gateways/api/RealisasiAPI';
import Realisasi from './Realisasi';
import RealisasiDetail from './RealisasiDetail';
import { getStepperProyekById } from '../../gateways/api/ProyekAPI';

export default function RealisasiRouter(props) {
  const { proyek } = props;
  const { user } = useContext(UserContext);

  const [loading, setLoading] = useState(true);
  const [realisasi, setRealisasi] = useState(null);
  const [status, setStatus] = useState(null);

  const otoritas = user.NIK === proyek.NIKREQ ? "BPO" : user.NIK === proyek.NIKPM ? "PM" : "PMO";
  // const otoritas = "PM";

  useEffect(() => {
    async function fetchData() {
      await getRealisasiByIdProyek(proyek.IDPROYEK)
        .then((response) => {
          setRealisasi(response.data);
        });
      await getStepperProyekById(proyek.IDPROYEK)
        .then((response) => {
          setStatus(response.data);
        });
      setLoading(false);
    }
    if (!realisasi) {
      setLoading(true);
      fetchData();
    }
  }, [realisasi, proyek]);

  if (loading)
    return <CircularProgress />;
  else if (otoritas === "PM" && realisasi && status && status.NOPLAN)
    return <Realisasi realisasi={realisasi} proyek={proyek} />;
  else if (realisasi && Object.keys(realisasi).length === 0)
    return <ErrorPage code="" message={otoritas === "PM" ? "Rencana Pelaksanaan belum diinput" : "Realisasi belum diinput"} />;
  else
    return <RealisasiDetail realisasi={realisasi} proyek={proyek} />;

};