import api from '../../utils/ApiConfig';

export const getBastByIdProyek = async (id) => {
  return await api.get('/proyek/risk/' + id);
};