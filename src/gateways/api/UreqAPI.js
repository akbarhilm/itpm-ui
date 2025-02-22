import api from '../../utils/ApiConfig';

export const getUreqByIdProyek = async (id) => {
  return await api.get('/proyek/ureq/' + id);
};

export const getUreqNoFD = async (grup) => {
  return await api.get('/proyek/ureq/nofd',{params:{grupaplikasi:grup}} );
};

export const createUreq = async (data) => {
  return await api.post('/proyek/ureq/tambah', data);
};

export const updateUreq = async (data) => {
  return await api.put('/proyek/ureq/ubah', data);
};

export const uploadFile = async(data)=>{
  return await api.post('/proyek/ureq/upload',data,{headers: {
    'Content-Type': 'multipart/form-data'
  }});
}

export const downloadFile = async(data)=>{
  
  return await api.get('/proyek/ureq/download',{responseType:'blob', params:{filename:data.filename}})
}
