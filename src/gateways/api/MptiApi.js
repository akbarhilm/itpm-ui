import api from '../../utils/ApiConfig';

export const getMpti = async () => {
    return await api.get('/ref/mpti');
  };

export const addMpti = async (data) => {
    return await api.post('/ref/mpti/tambah',data);
};

export const updateMpti = async (data) => {
  return await api.put('/ref/mpti/edit',data);
};

export const deleteMpti = async (id) => {
  console.log(id);
  return await api.delete('/ref/mpti/hapus',{data:id});
};