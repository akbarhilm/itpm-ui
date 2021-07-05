import axios from "axios";
import Cookies from "universal-cookie";
// import { useHistory } from "react-router-dom";

// const history = useHistory();
const cookies = new Cookies();
export const token = cookies.get("token");

console.log("token", token);

// function api(){}
// const history
const api = axios.create({
  baseURL: "http://" + process.env.REACT_APP_HOST_API + ":5000/api/",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => { return response; },
  (error) => {
    window.location.replace("/401");
    // return Promise.reject(error);
  });
// api.defaults.headers.common["Authorization"] = token;

// export const api5001 = axios.create({
//   baseURL: "http://10.10.40.141:5001/api/",
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// api5001.defaults.headers.common["Authorization"] = token;

export default api;