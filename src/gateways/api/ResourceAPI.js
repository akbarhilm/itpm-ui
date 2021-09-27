import api from '../../utils/ApiConfig';

export const getResourceByIdProyek = async (id) => {
  return await api.get('/proyek/risk/' + id); //ganti api resource
};