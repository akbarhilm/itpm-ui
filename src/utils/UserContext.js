import { createContext, useEffect, useState } from 'react';
import { getUser } from '../gateways/api/CommonAPI';
import { setAuthApi } from './ApiConfig';
import Cookies from "universal-cookie";
import { getAuth } from './Auth';

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

    // condition for login from info
    if (params.get("token")) {
      setAuthApi("Bearer " + params.get("token"));
      findUser();
      cookies.set('auth', params.get("token"), { path: '/' });
    }
    // if cookies has set for auth
    else {
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
