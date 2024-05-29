import api from '../../utils/ApiConfig';

export const getListProyek2 = async (status, dashboard, nik,state) => {
  //return await api.get('/profil/pengguna/proyek/nik', { params: { status: status, d: dashboard || null, nik: nik || null , sap : state?state.SAP : null, non:state?state.NON_SAP:null} });
  return await api.get('/proyek/listproyek');
};
export const getListProyek = async (status, dashboard, nik,state) => {
  return await api.get('/profil/pengguna/proyek/nik', { params: { status: status, d: dashboard || null, nik: nik || null , sap : state?state.SAP : null, non:state?state.NON_SAP:null} });
  //return await api.get('/proyek/listproyek');
};

export const getSummaryProyek = async (year) => {
  return await api.get('/profil/pengguna/proyek/summary',{params:{tahun:year}});
};

export const getProyekById = async (id) => {
  return await api.get('/proyek/detail/' + id);
};

export const createProyek = async (data) => {
  return await api.post('/proyek/tambah', data);
};

export const updateProyek = async (data) => {
  return await api.put('/proyek/ubah', data);
};

export const getStepperProyekById = async (id) => {
  return await api.get('/proyek/stepper/' + id);
};

export const ubahStatusProyek = async (data) => {
  return await api.put('/proyek/ubahstatus', data);
};

export const getSummaryBy = async () => {
  return await api.get('/proyek/summaryby');
};

export const getListPro = async () =>{
  return await api.get('/proyek/listproyek');
}