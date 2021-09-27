import api from '../../utils/ApiConfig';

export const getRisikoByIdProyek = async (id) => {
  return await api.get('/proyek/risk/' + id);
};