import api from '../../utils/ApiConfig';

export const getUreqByIdProyek = async (id) => {
  return await api.get('/proyek/ureq/' + id);
};

export const createUreq = async (data) => {
  return await api.post('/proyek/ureq/tambah', data);
};

export const updateUreq = async (data) => {
  return await api.put('/proyek/ureq/ubah', data);
};
