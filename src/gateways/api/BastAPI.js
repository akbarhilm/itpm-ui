import api from '../../utils/ApiConfig';

export const createBast = async (data) => {
  return await api.post('/proyek/ba/tambah', data);
};

export const approveBast = async (data) => {
  return await api.post('/proyek/ba/approve', data);
};