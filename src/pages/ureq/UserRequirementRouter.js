import React, { useContext, useEffect, useState } from 'react';
import { getCharterByIdProyek } from '../../gateways/api/CharterAPI';
import { CircularProgress } from '@material-ui/core';
import ErrorPage from '../../components/ErrorPage';
import { UserContext } from '../../utils/UserContext';
import UserRequirement from "../pages/ureq/UserRequirement";
import UserRequirementDetail from "../pages/ureq/UserRequirementDetail";

export default function UserRequirementRouter(props) {
  const { proyek } = props;
  const { user } = useContext(UserContext);

  const [loading, setLoading] = useState(true);
  const [ureq, setUreq] = useState(null);

  // const otoritas = user.NIK === proyek.NIKREQ ? "BPO" : user.NIK === proyek.NIKPM ? "PM" : "PMO"; 
  const otoritas = "PM";

  useEffect(() => {
    if (!ureq) {
      setLoading(true);
      getCharterByIdProyek(proyek.IDPROYEK)
        .then((response) => {
          setUreq(response.data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [ureq, proyek]);

  if (loading)
    return <CircularProgress />;
  else if (otoritas === "PM" && ureq)
    return <UserRequirement ureq={ureq} proyek={proyek} />;
  else if (ureq && Object.keys(ureq).length === 0)
    return <ErrorPage code="" message="Charter belum diinput" />;
  else
    return <UserRequirementDetail ureq={ureq} proyek={proyek} />;

};