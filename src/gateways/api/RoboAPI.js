import api from '../../utils/ApiConfig';

export const getRoboByIdProyek = async (id) => {
  return await api.get('/proyek/robo/' + id);
};

export const createRobo = async (data) => {
  return await api.post('/proyek/robo/tambah', data);
};

export const updateResource = async (data) => {
  return await api.put('/proyek/resource/ubah', data);
};

export const getRef = async (id) => {
  return await api.get('/proyek/robo/ref');
}