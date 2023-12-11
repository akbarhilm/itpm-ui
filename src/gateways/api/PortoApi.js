import api from '../../utils/ApiConfig';

export const getPorto = async () => {
    return await api.get('/ref/porto');
  };

export const addPorto = async (data) => {
    return await api.post('/ref/porto/tambah',data);
};

export const updatePorto = async (data) => {
  return await api.put('/ref/porto/edit',data);
};

export const deletePorto = async (id) => {
  console.log(id);
  return await api.delete('/ref/porto/hapus',{data:id});
};