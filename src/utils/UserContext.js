import { createContext, useEffect, useState } from 'react';
import { getAllKaryawan, getAllKegiatan, getAuthFromAPI, getUser } from '../gateways/api/CommonAPI';
import { setAuthApi } from './ApiConfig';
import Cookies from "universal-cookie";
import { getAuth } from './Auth';
import axios from 'axios';
import Crypto from 'crypto-js';

//set initial value of user to null (pre-login)
export const UserContext = createContext(null);

export function useFindUser() {
  const [user, setUser] = useState(null);
  const [karyawan, setKaryawan] = useState(null);
  const [kegiatan, setKegiatan] = useState(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const cookies = new Cookies();
    const params = new URLSearchParams(window.location.search);

    async function getReference() {
      await getAllKegiatan()
        .then((response) => {
          setKegiatan(response.data);
        });
      await getAllKaryawan()
        .then((response) => {
          setKaryawan(response.data);
        });
      setLoading(false);
    }

    async function findUser() {
      let user = {};
      await getUser()
        .then(res => {
          user = res.data;
        });
      await getAuthFromAPI()
        .then(res => {
          user.OTORITAS = res.data.map(d => d.KODEAUTH);
        });
      if (Object.keys(user).length > 0)
        setUser(user);
    }

    async function getValidTokenFromInfo() {
      const url = process.env.REACT_APP_HOST_LOGIN + "apps-authentication";
      const data = params.get("access_token");
      const config = { headers: { "Content-Type": "multipart/form-data" } };
      let bodyFormData = new FormData();
      bodyFormData.append("access_token", data);
      return await axios.post(url, bodyFormData, config);
    }

    // condition for login from info
    if (params.get("access_token")) {
      getValidTokenFromInfo()
        .then((response) => {
          setAuthApi("Bearer " + response.data.token);
          const dataEcnrypt = Crypto.AES.encrypt(response.data.token, "encrypt-token-for-cookie").toString();
          cookies.set('auth', dataEcnrypt, { path: '/' });
          findUser()
            .then(() => getReference())
            .catch(() => setLoading(false));
        })
        .catch(() => {
          setLoading(false);
        });
    }
    // if cookies has set for auth
    else {
      setAuthApi(getAuth());
      findUser()
        .then(() => getReference())
        .catch(() => setLoading(false));
    }
  }, []);

  return {
    user,
    setUser,
    isLoading,
    setLoading,
    karyawan,
    kegiatan
  };
}
