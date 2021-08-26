import api from '../../utils/ApiConfig';

export const getUser = async () => {
  return await api.get('/profil/pengguna/nik');
};

export const getAuthFromAPI = async () => {
  return await api.get('/profil/pengguna/otoritas/nik');
};

export const getMenuSideBar = async (id) => {
  return await api.get('/profil/menu/proyek/nik/' + id);
};

export const getAllKegiatan = async () => {
  return await api.get('/proyek/kegiatan');
};

export const getAllKaryawan = async () => {
  return await api.get('/profil/karyawan');
};