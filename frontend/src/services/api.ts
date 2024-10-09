import axios, { AxiosRequestConfig } from "axios";
import { getUserIdAndToken } from "../global/getUserIdAndToken";

const authorizationInterceptor: any = async (config: AxiosRequestConfig) => {
  if (!config.headers?.Authorization) {
    const { token } = getUserIdAndToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
};

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

api.interceptors.request.use(authorizationInterceptor);

export default api;
