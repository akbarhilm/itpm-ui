import api from '../../utils/ApiConfig';

export const getListProyek = async () => {
  return await api.get('/profil/pengguna/proyek/nik');
};

export const getProyekById = async (id) => {
  return await api.get('/proyek/detail/' + id);
};

export const createProyek = async (data) => {
  return await api.post('/proyek/tambah', data);
};

export const updateProyek = async (data) => {
  return await api.put('/proyek/ubah', data);
};

export const getStepperProyekById = async (id) => {
  return await api.get('/proyek/stepper/' + id);
};