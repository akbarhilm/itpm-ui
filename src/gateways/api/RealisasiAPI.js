import api from '../../utils/ApiConfig';

export const getRealisasiByIdProyek = async (id) => {
  return await api.get('/proyek/real/' + id);
};

export const createRealisasi = async (data) => {
  return await api.post('/proyek/real/tambah', data);
};

export const updateRealisasi = async (data) => {
  return await api.put('/proyek/real/ubah', data);
};