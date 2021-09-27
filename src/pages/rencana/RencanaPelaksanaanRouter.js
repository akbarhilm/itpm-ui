import React, { useContext, useEffect, useState } from 'react';
import { CircularProgress } from '@material-ui/core';
import ErrorPage from '../../components/ErrorPage';
import { UserContext } from '../../utils/UserContext';
import RencanaPelaksanaan from './RencanaPelaksanaan';
import RencanaPelaksanaanDetail from './RencanaPelaksanaanDetail';
import { getRencanaPelaksanaanByIdProyek } from '../../gateways/api/PlanAPI';
import { getStepperProyekById } from '../../gateways/api/ProyekAPI';
import { getAllKegiatan, getAllKaryawan } from '../../gateways/api/CommonAPI';
import { getCharterByIdProyek } from '../../gateways/api/CharterAPI';

export default function RencanaPelaksanaanRouter(props) {
  const { proyek } = props;
  const { user } = useContext(UserContext);

  const [loading, setLoading] = useState(true);
  const [plan, setPlan] = useState(null);
  const [tglAwalCharter, setTglAwalCharter] = useState(null);
  const [status, setStatus] = useState(null);
  const [kegiatan, setKegiatan] = useState(null);
  const [karyawan, setKaryawan] = useState(null);

  const otoritas = user.NIK === proyek.NIKREQ ? "BPO" : user.NIK === proyek.NIKPM ? "PM" : "PMO";
  // const otoritas = "PM";

  useEffect(() => {
    async function fetchData() {
      await getCharterByIdProyek(proyek.IDPROYEK)
        .then((response) => {
          if (Object.keys(response.data).length > 0)
            setTglAwalCharter(response.data.TGLMULAI);
        });
      await getRencanaPelaksanaanByIdProyek(proyek.IDPROYEK)
        .then((response) => {
          setPlan(response.data);
        });
      await getStepperProyekById(proyek.IDPROYEK)
        .then((response) => {
          setStatus(response.data);
        });
      await getAllKegiatan()
        .then((response) => {
          const orderListKegiatan = response.data.sort((a, b) => a.IDKEGIATAN - b.IDKEGIATAN).map(d => ({
            id: d.IDKEGIATAN,
            kegiatan: d.NAMAKEGIATAN,
            target: d.NAMATARGET
          }));
          setKegiatan(orderListKegiatan);
        });
      await getAllKaryawan()
        .then((response) => {
          setKaryawan(response.data.filter(d => d.organisasi.includes("IT")));
        });
      setLoading(false);
    }
    if (!plan) {
      setLoading(true);
      fetchData();
    }
  }, [plan, proyek]);

  if (loading)
    return <CircularProgress />;
  else if (otoritas === "PM" && plan && status && status.NOUREQ)
    return <RencanaPelaksanaan plan={plan} proyek={proyek} kegiatan={kegiatan} karyawan={karyawan} minDate={tglAwalCharter} />;
  // return <RencanaPelaksanaan plan={plan} proyek={proyek} kegiatan={kegiatan} />;
  else if (plan && Object.keys(plan).length === 0)
    return <ErrorPage code="" message={"Rencana Pelaksanaan belum diinput"} />;
  else
    return <RencanaPelaksanaanDetail plan={plan} kegiatan={kegiatan} karyawan={karyawan} />;
};