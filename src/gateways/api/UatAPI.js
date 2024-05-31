import api from '../../utils/ApiConfig';

export const getUatByIdProyek = async (id) => {
  return await api.get('/proyek/uat?id=' + id);
};

export const getUatByIdUat = async (id) => {
  return await api.get('/proyek/uat/' + id);
};

export const createUat = async (data) => {
  return await api.post('/proyek/uat/tambah', data);
};

export const updateUat = async (data) => {
  return await api.put('/proyek/uat/ubah', data);
};

export const approveQA = async (data) => {
  return await api.put('/proyek/uat/approveqa', data);
};

export const approveUser = async (data) => {
  return await api.put('/proyek/uat/approveuser', data);
};

export const uploadFile = async(data)=>{
  return await api.post('/proyek/uat/upload',data,{headers: {
    'Content-Type': 'multipart/form-data'
  }});
}

export const downloadFile = async(data)=>{
  
  return await api.get('/proyek/uat/download',{responseType:'blob', params:{filename:data.filename}})
}

export const simpanUpl = async(data)=>{
  return await api.put('/proyek/uat/file',data);
}