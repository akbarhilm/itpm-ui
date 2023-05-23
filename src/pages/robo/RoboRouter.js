import React, { useContext, useEffect, useState } from 'react';
import { CircularProgress } from '@material-ui/core';
import ErrorPage from '../../components/ErrorPage';
import { UserContext } from '../../utils/UserContext';
import { getRoboByIdProyek, getRef } from '../../gateways/api/RoboAPI';
import Robo from './Robo';
import { getStepperProyekById } from '../../gateways/api/ProyekAPI';
import { getRisikoByIdProyek } from '../../gateways/api/RisikoAPI';

export default function RoboRouter(props) {
  const { proyek } = props;
  //const { user } = useContext(UserContext);
  const { user, karyawan: cKaryawan } = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const [robo, setRobo] = useState(null);
  const [status, setStatus] = useState(null);
  const [refe, setRefe] = useState(null);
  const [risk,setRisk] = useState(null);
  const [karyawan, setKaryawan] = useState(null);

  const otoritas = user.NIK === proyek.NIKREQ ? "BPO" : user.NIK === proyek.NIKPM ? "PM" : "PMO";
  // const otoritas = "PM";

  useEffect(() => {
    async function fetchData() {
      await getRoboByIdProyek(proyek.IDPROYEK)
        .then((response) => {
          setRobo(response.data);
        });
      await getStepperProyekById(proyek.IDPROYEK)
        .then((response) => {
          setStatus(response.data);
        });
        await getRef()
        .then((response) => {
          setRefe(response.data);
        });
        await getRisikoByIdProyek(proyek.IDPROYEK)
        .then((response) => {
          setRisk(response.data);
        });
      setLoading(false);
      setKaryawan(cKaryawan.filter(d => d.organisasi.includes("IT")));
    }
    if (!robo) {
      setLoading(true);
      fetchData();
    }
  }, [robo, proyek,cKaryawan]);

  if (loading)
    return <CircularProgress />;
  else if (otoritas === "PM" && status && status.NOUAT && !status.NOBA){
  console.log("masuk pertama")
  console.log(karyawan)
    return <Robo robo={robo} proyek={proyek} karyawan={karyawan} refe={refe} risk={risk}/>;
  }
  else if (robo && robo.LISTDETAIL.new){
  console.log("masuk dua")
    return <ErrorPage code="" message={otoritas === "PM" ? "UAT (User Acceptence Test) belum diinput" : "Rollout Backout belum diinput"} />;
  }

};