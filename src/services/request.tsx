import axios, { AxiosPromise, AxiosRequestConfig, Method } from "axios";
import { history } from "@/common/router";

export interface ICommonResponse {
  code: number;
  message: string;
}

axios.defaults.headers.post["Content-Type"] = "application/json;charset=UTF-8";

axios.interceptors.request.use(
  (config: AxiosRequestConfig): AxiosRequestConfig => {
    const token = localStorage.getItem("token");
    config.headers.Authorization = `Bearer ${token}`;

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

axios.interceptors.response.use(
  (response) => {
    const { authorization } = response.headers;
    authorization && localStorage.setItem("authToken", authorization);
    return response.data;
  },
  (error) => {
    if (error.response.status === 401) {
      history.push("/user/login");
    }
    return Promise.reject(error);
  },
);

export const request = <T extends any>(url: string, data: any, method: Method): AxiosPromise<T> => {
  return axios({
    method,
    url,
    data,
  });
};

export const post = <T extends any>(url: string, data: any): AxiosPromise<T> => {
  return request(url, data, "post");
};

export const put = <T extends any>(url: string, data: any): AxiosPromise<T> => {
  return request(url, data, "put");
};

export const get = <T extends any>(url: string, data?: any): AxiosPromise<T> => {
  return request(url, data, "get");
};
