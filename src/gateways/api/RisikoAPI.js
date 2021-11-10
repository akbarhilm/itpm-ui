import api from '../../utils/ApiConfig';

export const getRisikoByIdProyek = async (id) => {
  return await api.get('/proyek/risk/' + id);
};

export const createRisiko = async (data) => {
  return await api.post('/proyek/risk/tambah', data);
};

export const updateRisiko = async (data) => {
  return await api.put('/proyek/risk/ubah', data);
};