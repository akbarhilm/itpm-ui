import React, { useContext, useEffect, useState } from 'react';
import { getCharterByIdProyek } from '../../gateways/api/CharterAPI';
import { CircularProgress } from '@material-ui/core';
import Charter from './Charter';
import CharterDetail from './CharterDetail';
import ErrorPage from '../../components/ErrorPage';
import { UserContext } from '../../utils/UserContext';

export default function CharterRouter(props) {
  const { proyek } = props;
  const { user } = useContext(UserContext);

  const [loading, setLoading] = useState(true);
  const [charter, setCharter] = useState(null);

  const otoritas = user.NIK === proyek.NIKREQ ? "BPO" : user.NIK === proyek.NIKPM ? "PM" : "PMO";

  useEffect(() => {
    if (!charter) {
      // get charter by id proyek from api
      setLoading(true);
      getCharterByIdProyek(proyek.IDPROYEK)
        .then((response) => {
          setCharter(response.data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [charter, proyek]);

  // if (loading)
  //   return <CircularProgress />;
  // else if ((otoritas === "PM" && charter && Object.keys(charter).length === 0) || (otoritas === "PM" && charter && charter.KODEAPPROVE === "0"))
  //   return <Charter charter={charter} />;
  // else if (charter && Object.keys(charter).length === 0)
  //   return <ErrorPage code="" message="Charter belum diinput" />;
  // else if (otoritas === "BPO" && charter)
  //   return <>Approval Page</>; // Approval Page
  // else
  //   return <CharterDetail charter={charter} proyek={proyek} />;

  console.log(charter);
  if (loading)
    return <CircularProgress />;
  else
    return <CharterDetail charter={charter} proyek={proyek} />;
};