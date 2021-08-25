import api from '../../utils/ApiConfig';

export const getRencanaPelaksanaanByIdProyek = async (id) => {
  return await api.get('/proyek/plan/' + id); // ganti sesuai dengan api get plan
};