import axios from "axios";

const api = axios.create({
   //baseURL:"http://localhost:5000/api/",
  baseURL: "http://" + process.env.REACT_APP_HOST_API + ":5000/api/",
  headers: {
    "Content-Type": "application/json",
  },
});

export const setAuthApi = (auth) => {
  api.defaults.headers.common["Authorization"] = auth;
};

export default api;