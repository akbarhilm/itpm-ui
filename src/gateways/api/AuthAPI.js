import api from '../../utils/ApiConfig';

export const getAuthInfo = async (data) => {
  return await api.post('/jwt/set', { token: data });
};