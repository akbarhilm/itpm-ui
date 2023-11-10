import api from '../../utils/ApiConfig';

export const getPorto = async () => {
    return await api.get('/ref/porto');
  };