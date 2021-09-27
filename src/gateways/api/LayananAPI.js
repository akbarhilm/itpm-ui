import api from '../../utils/ApiConfig';

export const getLayananUnused = async (idproj) => {
  return await api.get('/proyek/layanan/unused', idproj ? { params: { idproj: idproj } } : null);
};