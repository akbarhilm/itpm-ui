import React, { useContext, useEffect, useState } from 'react';
import { CircularProgress } from '@material-ui/core';
import ErrorPage from '../../components/ErrorPage';
import { UserContext } from '../../utils/UserContext';
import UserRequirement from "./UserRequirement";
import UserRequirementDetail from "./UserRequirementDetail";
import { getUreqByIdProyek,getUreqNoFD } from '../../gateways/api/UreqAPI';
import { getStepperProyekById } from '../../gateways/api/ProyekAPI';

export default function UserRequirementRouter(props) {
  const { proyek } = props;
  const { user } = useContext(UserContext);

  const [loading, setLoading] = useState(true);
  const [ureq, setUreq] = useState(null);
  const [status, setStatus] = useState(null);
  const [nofd,setNofd] = useState(null)

  const otoritas = user.NIK === proyek.NIKREQ ? "BPO" : user.NIK === proyek.NIKPM ? "PM" : "PMO";
  // const otoritas = "PM";

  useEffect(() => {
    async function fetchData() {
      await getUreqByIdProyek(proyek.IDPROYEK)
        .then((response) => {
          setUreq(response.data);
          // setLoading(false);
        });
      // .catch(() => setLoading(false));
      await getUreqNoFD(proyek.APLIKASI.GRUPAPLIKASI)
        .then(res=>{
          setNofd(res.data[0].NOFD);
        })
      await getStepperProyekById(proyek.IDPROYEK)
        .then((response) => {
          setStatus(response.data);
          // setLoading(false);
        });
      // .catch(() => setLoading(false));
      setLoading(false);
    }
    if (!ureq) {
      setLoading(true);
      fetchData();
    }
  }, [ureq, proyek]);

  if (loading)
    return <CircularProgress />;
  else if ((otoritas === "PM" || otoritas === "PMO")  && ureq && status &&  !status.NOBA)
    return <UserRequirement ureq={ureq} proyek={proyek} fd={nofd} />;
  else if (ureq && Object.keys(ureq).length === 0)
    return <ErrorPage code="" message={"Kebutuhan Pengguna belum diinput"} />;
  else
    return <UserRequirementDetail ureq={ureq} />;

};