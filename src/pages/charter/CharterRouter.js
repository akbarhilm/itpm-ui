import React, { useContext, useEffect, useState } from 'react';
import { getCharterByIdProyek } from '../../gateways/api/CharterAPI';
import { CircularProgress } from '@material-ui/core';
import Charter from './Charter';
import CharterDetail from './CharterDetail';
import CharterApproval from './CharterApproval';
import ErrorPage from '../../components/ErrorPage';
import { UserContext } from '../../utils/UserContext';
import { getStepperProyekById } from '../../gateways/api/ProyekAPI';

export default function CharterRouter(props) {
  const { proyek } = props;
  const { user } = useContext(UserContext);

  const [loading, setLoading] = useState(true);
  const [charter, setCharter] = useState(null);
  const [status, setStatus] = useState(null);

  const otoritas = user.NIK === proyek.NIKREQ ? "BPO" : user.NIK === proyek.NIKPM ? "PM" : "PMO";
  // const otoritas = "BPO";

  useEffect(() => {
    async function fetchData() {
      await getCharterByIdProyek(proyek.IDPROYEK)
        .then((response) => {
          if (Object.keys(response.data).length > 0) {
            const tujuan = response.data.LISTDETAIL.filter(d => d.KODEDETAIL === "TUJUAN");
            const scope = response.data.LISTDETAIL.filter(d => d.KODEDETAIL === "SCOPE");
            const target = response.data.LISTDETAIL.filter(d => d.KODEDETAIL === "TARGET");
            delete response.data.LISTDETAIL;
            const formatData = {
              ...response.data,
              TUJUAN: tujuan,
              SCOPE: scope,
              TARGET: target
            };
            setCharter(formatData);
          } else setCharter(response.data);
          setLoading(false);
        });
      await getStepperProyekById(proyek.IDPROYEK)
        .then((response) => {
          setStatus(response.data);
        });
      setLoading(false);
    }

    if (!charter) {
      setLoading(true);
      fetchData();
    }
  }, [charter, proyek]);

  if (loading)
    return <CircularProgress />;
  else if (((otoritas === "PM" || otoritas === "PMO") && charter && Object.keys(charter).length === 0) || ((otoritas === "PM" || otoritas === "PMO") && charter && charter.KODEAPPROVE === "0"))
    return <Charter charter={charter} proyek={proyek} />;
  else if (charter && Object.keys(charter).length === 0)
    return <ErrorPage code="" message="Charter belum diinput" />;
  else if (otoritas === "BPO" && charter && Object.keys(charter).length > 0 && status && !status.NOUREQ)
    return <CharterApproval charter={charter} proyek={proyek} />;
  else
    return <CharterDetail charter={charter} proyek={proyek} />;

};