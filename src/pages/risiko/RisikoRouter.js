import React, { useContext, useEffect, useState } from 'react';
import { CircularProgress } from '@material-ui/core';
import ErrorPage from '../../components/ErrorPage';
import { UserContext } from '../../utils/UserContext';
import Risiko from './Risiko';
import RisikoDetail from './RisikoDetail';
import { getRisikoByIdProyek } from '../../gateways/api/RisikoAPI';
import { getStepperProyekById } from '../../gateways/api/ProyekAPI';

export default function RisikoRouter(props) {
  const { proyek } = props;
  const { user } = useContext(UserContext);

  const [loading, setLoading] = useState(true);
  const [risiko, setRisiko] = useState(null);
  const [status, setStatus] = useState(null);

  const otoritas = user.NIK === proyek.NIKREQ ? "BPO" : user.NIK === proyek.NIKPM ? "PM" : "PMO";
  // const otoritas = "PM";

  useEffect(() => {
    async function fetchData() {
      await getRisikoByIdProyek(proyek.IDPROYEK)
        .then((response) => {
          setRisiko(response.data);
        });
      await getStepperProyekById(proyek.IDPROYEK)
        .then((response) => {
          setStatus(response.data);
        });
      setLoading(false);
    }
    if (!risiko) {
      setLoading(true);
      fetchData();
    }
  }, [risiko, proyek]);

  if (loading)
    return <CircularProgress />;
  else if (otoritas === "PM" && risiko && status && status.NOPLAN)
    return <Risiko risiko={risiko} proyek={proyek} />;
  else if (risiko && Object.keys(risiko).length === 0)
    return <ErrorPage code="" message={otoritas === "PM" ? "Rencana Pelaksanaan belum diinput" : "Kajian Risiko belum diinput"} />;
  else
    return <RisikoDetail risiko={risiko} proyek={proyek} />;

};