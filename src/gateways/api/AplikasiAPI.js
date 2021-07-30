import api from '../../utils/ApiConfig';

export const getAplikasi = async () => {
  return await api.get('/proyek/aplikasi');
};

export const createAplikasi = async (data) => {
  return await api.post('/proyek/aplikasi/tambah', data);
};