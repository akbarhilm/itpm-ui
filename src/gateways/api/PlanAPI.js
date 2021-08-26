import api from '../../utils/ApiConfig';

export const getRencanaPelaksanaanByIdProyek = async (id) => {
  return await api.get('/proyek/plan/' + id);
};

export const createRencanaPelaksanaan = async (data) => {
  return await api.post('/proyek/plan/tambah', data);
};

export const updateRencanaPelaksanaan = async (data) => {
  return await api.put('/proyek/plan/ubah', data);
};