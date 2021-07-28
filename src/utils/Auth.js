import Cookies from "universal-cookie";
import Crypto from 'crypto-js';

const cookies = new Cookies();

export function getAuth() {
  const auth = cookies.get('auth');
  if (auth) {
    const originalToken = Crypto.AES.decrypt(auth, "encrypt-token-for-cookie").toString(Crypto.enc.Utf8);
    return "Bearer " + originalToken;
  } else {
    return "";
  }
}
