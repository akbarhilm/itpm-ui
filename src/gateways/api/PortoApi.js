import api from '../../utils/ApiConfig';

export const getPorto = async () => {
  
    return await api.get('/ref/porto/');
  };

  export const getPortoById = async (id) => {
  
    return await api.get('/ref/porto/'+id);
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

export const getgrup = async()=>{
  return await api.get('/ref/porto/grup')
}

export const getkode = async()=>{
  return await api.get('/ref/porto/kode')
}

export const uploadFile = async(data)=>{
  return await api.post('/ref/porto/upload',data,{headers: {
    'Content-Type': 'multipart/form-data'
  }});
}

export const downloadFile = async(data)=>{
  
  return await api.get('/ref/porto/download',{responseType:'blob', params:{filename:data.filename}})
}

export const getCata = async()=>{
  return await api.get('/ref/cata/combocat')
}