import api from '../../utils/ApiConfig';

export const getModulByAplikasiId = async (idAplikasi) => {
  return await api.get('/proyek/modul', { params: { idaplikasi: idAplikasi } });
};

export const createModul = async (data) => {
  return await api.post('/proyek/modul/tambah', data);
};