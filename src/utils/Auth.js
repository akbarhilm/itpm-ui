import Cookies from "universal-cookie";
import Crypto from 'crypto-js';

const cookies = new Cookies();

export function getAuth() {
  const auth = cookies.get('auth');
  if (auth) {
    return "Bearer " + Crypto.AES.decrypt(auth, "encrypt-token-for-cookie");
  } else {
    return "";
  }
}
