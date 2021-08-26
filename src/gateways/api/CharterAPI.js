import api from '../../utils/ApiConfig';

export const getCharterByIdProyek = async (id) => {
  return await api.get('/proyek/charter/' + id);
};

export const createCharter = async (data) => {
  return await api.post('/proyek/charter/tambah', data);
};

export const updateCharter = async (data) => {
  return await api.put('/proyek/charter/ubah', data);
};

export const approveCharter = async (data) => {
  return await api.put('/proyek/charter/approve', data);
};