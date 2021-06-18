import api from '../../utils/ApiConfig';

export const getUser = async () => {
  return await api.get('/profil/pengguna/nik');
};

export const getMenuSideBar = async (id) => {
  return await api.get('/profil/menu/proyek/nik/' + id);
};