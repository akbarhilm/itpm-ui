import api from '../../utils/ApiConfig';

export const getCharterByIdProyek = async (id) => {
  return await api.get('/proyek/charter/' + id);
};

export const createCharter = async (data) => {
  return await api.post('/proyek/charter/tambah', data);
};

export const updateCharter = async (data) => {
  return await api.put('/proyek/charter/ubah', data);
};

export const approveCharter = async (data) => {
  return await api.put('/proyek/charter/approve', data);
};

export const uploadFile = async(data)=>{
  return await api.post('/proyek/charter/upload',data,{headers: {
    'Content-Type': 'multipart/form-data'
  }});
}

export const downloadFile = async(data)=>{
  
  return await api.get('/proyek/charter/download',{responseType:'blob', params:{filename:data.filename}})
}