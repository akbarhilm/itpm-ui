import React, { useContext, useEffect, useState } from 'react';
import { CircularProgress } from '@material-ui/core';
import ErrorPage from '../../components/ErrorPage';
import { UserContext } from '../../utils/UserContext';
import { getResourceByIdProyek } from '../../gateways/api/ResourceAPI';
import Resource from './Resource';
import ResourceDetail from './ResourceDetail';
import { getStepperProyekById } from '../../gateways/api/ProyekAPI';

export default function RencanaPelaksanaanRouter(props) {
  const { proyek } = props;
  const { user } = useContext(UserContext);

  const [loading, setLoading] = useState(true);
  const [resource, setResource] = useState(null);
  const [status, setStatus] = useState(null);

  const otoritas = user.NIK === proyek.NIKREQ ? "BPO" : user.NIK === proyek.NIKPM ? "PM" : "PMO";
  // const otoritas = "PM";

  useEffect(() => {
    async function fetchData() {
      await getResourceByIdProyek(proyek.IDPROYEK)
        .then((response) => {
          setResource(response.data);
        });
      await getStepperProyekById(proyek.IDPROYEK)
        .then((response) => {
          setStatus(response.data);
        });
      setLoading(false);
    }
    if (!resource) {
      setLoading(true);
      fetchData();
    }
  }, [resource, proyek]);

  if (loading)
    return <CircularProgress />;
  else if (otoritas === "PM" && resource && status && status.NOPLAN && !status.NOBA)
    return <Resource resource={resource} proyek={proyek} />;
  else if (resource && Object.keys(resource).length === 0)
    return <ErrorPage code="" message={otoritas === "PM" ? "Rencana Pelaksanaan belum diinput" : "Kebutuhan Sumber Daya belum diinput"} />;
  else
    return <ResourceDetail resource={resource} proyek={proyek} />;

};