import React, { useContext, useEffect, useState } from 'react';
import { CircularProgress } from '@material-ui/core';
import ErrorPage from '../../components/ErrorPage';
import { UserContext } from '../../utils/UserContext';
import { getRealisasiByIdProyek } from '../../gateways/api/RealisasiAPI';
import Realisasi from './Realisasi';
import RealisasiDetail from './RealisasiDetail';
import { getStepperProyekById } from '../../gateways/api/ProyekAPI';
import { getRencanaPelaksanaanByIdProyek } from '../../gateways/api/PlanAPI';

export default function RealisasiRouter(props) {
  const { proyek } = props;
  const { user, karyawan: cKaryawan, kegiatan: cKegiatan,role } = useContext(UserContext);

  const [loading, setLoading] = useState(true);
  const [plan, setPlan] = useState(null);
  const [realisasi, setRealisasi] = useState(null);
  const [status, setStatus] = useState(null);
  const [roles, setRoles] = useState(null);
  const [kegiatan, setKegiatan] = useState(null);
  const [karyawan, setKaryawan] = useState(null);
  const oto = user.OTORITAS.includes('PMO')
  const otoritas = oto ? "PMO" : user.NIK === proyek.NIKREQ ? "BPO" : user.NIK === proyek.NIKPM ? "PM":""
  // const otoritas = "PM";

  useEffect(() => {
    async function fetchData() {
      await getRencanaPelaksanaanByIdProyek(proyek.IDPROYEK)
        .then((response) => {
          setPlan(response.data);
        });
      await getRealisasiByIdProyek(proyek.IDPROYEK)
        .then((response) => {
          setRealisasi(response.data);
        });
      await getStepperProyekById(proyek.IDPROYEK)
        .then((response) => {
          setStatus(response.data);
        });
      setKegiatan(cKegiatan);
      setKaryawan(cKaryawan.filter(d => d.organisasi.includes("IT")));
      setLoading(false);

      const maprole = role.filter(d=>(d.IDAUTH!== 1 && d.IDAUTH !== 3  && d.IDAUTH !== 5)).map(d=>({
        id:d.IDAUTH.toString(),
        kode:d.KODEAUTH,
        nama:d.NAMAAUTH
  
      }))
  
      setRoles(maprole)
    }
    
    if (!realisasi) {
      setLoading(true);
      fetchData();
    }
  }, [realisasi, proyek, cKegiatan, cKaryawan,role]);

  if (loading)
    return <CircularProgress />;
  else if ((otoritas === "PM" || otoritas === "PMO") && realisasi && status && status.NOPLAN && !status.NOBA)
    return <Realisasi realisasi={realisasi} proyek={proyek} karyawan={karyawan} kegiatan={kegiatan} plan={plan} roles={roles} />;
  else if (realisasi && Object.keys(realisasi).length === 0)
    return <ErrorPage code="" message={otoritas === "PM" ? "Rencana Pelaksanaan belum diinput" : "Realisasi belum diinput"} />;
  else
    return <RealisasiDetail roles={roles}realisasi={realisasi} karyawan={karyawan} kegiatan={kegiatan} plan={plan} />;

};