import Cookies from "universal-cookie";
import Crypto from 'crypto-js';

const cookies = new Cookies();

export function getAuth() {
  const auth = cookies.get('auth');
  const originalToken = Crypto.AES.decrypt(auth, "encrypt-token-for-cookie").toString(Crypto.enc.Utf8);
  if (auth) {
    // console.log("coo", auth);
    // console.log("de", originalToken);
    return "Bearer " + originalToken;
  } else {
    return "";
  }
}
