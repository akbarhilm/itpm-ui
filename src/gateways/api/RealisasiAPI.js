import api from '../../utils/ApiConfig';

export const getRealisasiByIdProyek = async (id) => {
  return await api.get('/proyek/risk/' + id); // ganti sesuai dengan api get plan
};