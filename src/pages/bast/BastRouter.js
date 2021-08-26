import React, { useContext, useEffect, useState } from 'react';
import { CircularProgress } from '@material-ui/core';
import Charter from './Charter';
import CharterDetail from './CharterDetail';
import CharterApproval from './CharterApproval';
import ErrorPage from '../../components/ErrorPage';
import { UserContext } from '../../utils/UserContext';
import { getBastByIdProyek } from '../../gateways/api/BastAPI';

export default function CharterRouter(props) {
  const { proyek } = props;
  const { user } = useContext(UserContext);

  const [loading, setLoading] = useState(true);
  const [bast, setBast] = useState(null);

  const otoritas = user.NIK === proyek.NIKREQ ? "BPO" : user.NIK === proyek.NIKPM ? "PM" : "PMO";
  // const otoritas = "BPO";

  useEffect(() => {
    if (!bast) {
      // get bast by id proyek from api
      setLoading(true);
      getBastByIdProyek(proyek.IDPROYEK)
        .then((response) => {
          setBast(response.data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [bast, proyek]);

  if (loading)
    return <CircularProgress />;
  else if ((otoritas === "PM" && bast && Object.keys(bast).length === 0) || (otoritas === "PM" && bast && bast.KODEAPPROVE === "0"))
    return <Charter bast={bast} proyek={proyek} />;
  else if (bast && Object.keys(bast).length === 0)
    return <ErrorPage code="" message="Charter belum diinput" />;
  else if (otoritas === "BPO" && bast && Object.keys(bast).length > 0)
    return <CharterApproval bast={bast} proyek={proyek} />;
  else
    return <CharterDetail bast={bast} proyek={proyek} />;

};