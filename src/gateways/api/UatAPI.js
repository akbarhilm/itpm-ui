import api from '../../utils/ApiConfig';

export const getUatByIdProyek = async (id) => {
  return await api.get('/proyek/risk/' + id);
};