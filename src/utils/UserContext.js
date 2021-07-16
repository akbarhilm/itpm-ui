import { createContext, useEffect, useState } from 'react';
import { getUser } from '../gateways/api/CommonAPI';
import { setAuthApi } from './ApiConfig';
import Cookies from "universal-cookie";
import { getAuth } from './Auth';
import axios from 'axios';
import Crypto from 'crypto-js';

//set initial value of user to null (pre-login)
export const UserContext = createContext(null);

export function useFindUser() {
  const [user, setUser] = useState(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const cookies = new Cookies();
    const params = new URLSearchParams(window.location.search);

    async function findUser() {
      await getUser()
        .then(res => {
          setUser(res.data);
          setLoading(false);
        }).catch(err => {
          setLoading(false);
        });
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
          console.log(response.data.token);
          setAuthApi("Bearer " + response.data.token);
          const dataEcnrypt = Crypto.AES.encrypt(response.data.token, "encrypt-token-for-cookie").toString();
          cookies.set('auth', dataEcnrypt, { path: '/' });
          findUser();
        })
        .catch(() => {
          setLoading(false);
        });
    }
    // if cookies has set for auth
    else {
      console.log(getAuth());
      setAuthApi(getAuth());
      findUser();
    }
  }, []);

  return {
    user,
    setUser,
    isLoading
  };
}
