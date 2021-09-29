import api from '../../utils/ApiConfig';

export const getResourceByIdProyek = async (id) => {
  return await api.get('/proyek/resource/' + id);
};

export const createResource = async (data) => {
  return await api.post('/proyek/resource/tambah', data);
};

export const updateResource = async (data) => {
  return await api.put('/proyek/resource/ubah', data);
};