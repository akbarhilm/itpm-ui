import api from '../../utils/ApiConfig';

export const getProker = async () => {
    return await api.get('/ref/proker');
  };

export const addProker = async (data) => {
    return await api.post('/ref/proker/tambah',data);
};

export const updateProker = async (data) => {
  return await api.put('/ref/proker/edit',data);
};

export const deleteProker = async (id) => {
  console.log(id);
  return await api.delete('/ref/proker/hapus',{data:id});
};