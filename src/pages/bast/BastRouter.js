import React, { useContext, useEffect, useState } from 'react';
import { CircularProgress } from '@material-ui/core';
import ErrorPage from '../../components/ErrorPage';
import { UserContext } from '../../utils/UserContext';
// import { getBastByIdProyek } from '../../gateways/api/BastAPI';
import { getProyekById, getStepperProyekById } from '../../gateways/api/ProyekAPI';
import BastAdd from './BastAdd';
import Bast from './Bast';

export default function BastRouter(props) {
  const { proyek } = props;
  const { user, karyawan } = useContext(UserContext);

  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(null);
  const [bast, setBast] = useState(null);

  const otoritas = user.NIK === proyek.NIKREQ ? "BPO" : user.NIK === proyek.NIKPM ? "PM" : user.OTORITAS.find(d => d === 'PMO') ? "PMO" : "BOD";
  // const otoritas = "PMO";
  const message = otoritas === "PMO" ?
    "UAT (User Acceptance Test) belum diinput."
    : "BAST (Berita Acara Serah Terima) belum dibuat oleh PMO.";


  useEffect(() => {
    async function fetchData() {
      await getStepperProyekById(proyek.IDPROYEK)
        .then((response) => {
          setStatus(response.data);
          // setStatus({ NOBA: "1/test" });
        });
      await getProyekById(proyek.IDPROYEK)
        .then((response) => {
          setBast({
            nomor: response.data.NOBA,
            tanggalBa: response.data.TGLBA,
            approve: response.data.KODEAPROVEBA,
            tanggalApprove: response.data.TGLAPROVEBA,
            pm: karyawan.filter(d => d.nik === response.data.NIKPM).length > 0 ? karyawan.filter(d => d.nik === response.data.NIKPM)[0] : null,
            user: karyawan.filter(d => d.nik === response.data.NIKREQ).length > 0 ? karyawan.filter(d => d.nik === response.data.NIKREQ)[0] : null,
          });
          // setBast({
          //   nomor: "xxx/BAST/IT0000/10/2021",
          //   tanggalBa: "13/10/2021",
          //   approve: "0",
          //   tanggalApprove: null,
          //   pm: karyawan.filter(d => d.nik === "160035").length > 0 ? karyawan.filter(d => d.nik === "160035")[0] : null,
          //   user: karyawan.filter(d => d.nik === "180136").length > 0 ? karyawan.filter(d => d.nik === "180136")[0] : null,
          // });
        });
      setLoading(false);
    }
    if (!status) {
      setLoading(true);
      fetchData();
    }
  }, [status, proyek, karyawan]);

  if (loading)
    return <CircularProgress />;
  else if (otoritas === "PMO" && status && status.NOUAT && !status.NOBA)
    return <BastAdd proyek={proyek} refresh={setStatus} />;
  else if (status && !status.NOBA)
    return <ErrorPage code="" message={message} />;
  else
    return <Bast proyek={proyek} bast={bast} otoritas={otoritas} refresh={setStatus} />;

};