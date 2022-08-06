import axios, { AxiosRequestConfig } from "axios";

interface HttpResponse {
  data?: Record<string, any>;
  code: string;
  message: string;
  success: boolean;
}

const HttpSuccessCode = "200";
const baseUrl = "/pac/api";

class Http {
  constructor() {}
  get(url: string, config?: AxiosRequestConfig<any> | undefined) {
    return new Promise<HttpResponse>((resolve, reject) => {
      axios.get(url, { ...config, baseURL: baseUrl }).then((result) => {
        resolve(result.data);
        if (
          result.data.code !== HttpSuccessCode ||
          result.data.success !== true
        ) {
        }
      });
    });
  }
  post(url: string, config?: AxiosRequestConfig<any> | undefined) {
    return new Promise<HttpResponse>((resolve, reject) => {
      const { data, params } = config as AxiosRequestConfig<any>;
      axios.post(url, data, { params, baseURL: baseUrl }).then((result) => {
        resolve(result.data);
        if (
          result.data.code !== HttpSuccessCode ||
          result.data.success !== true
        ) {
        }
      });
    });
  }
  put(url: string, config?: AxiosRequestConfig<any> | undefined) {
    return new Promise<HttpResponse>((resolve, reject) => {
      const { data, params } = config as AxiosRequestConfig<any>;
      axios.put(url, data, { params, baseURL: baseUrl }).then((result) => {
        resolve(result.data);
        if (
          result.data.code !== HttpSuccessCode ||
          result.data.success !== true
        ) {
        }
      });
    });
  }
}

export default new Http();
