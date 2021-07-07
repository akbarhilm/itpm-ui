import Cookies from "universal-cookie";

const cookies = new Cookies();

export function getAuth() {
  const auth = cookies.get('auth');
  if (auth) {
    return "Bearer " + auth;
  } else {
    return "";
  }
}
