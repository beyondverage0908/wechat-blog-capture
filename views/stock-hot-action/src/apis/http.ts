import axios, { AxiosRequestConfig } from "axios";

interface HttpResponse {}

const HttpSuccessCode = "200";
const baseUrl = "/pac/api";

class Http {
  constructor() {}
  get(url: string, config: AxiosRequestConfig<any> | undefined) {
    return new Promise((resolve, reject) => {
      axios.get(url, { ...config, baseURL: baseUrl }).then((result) => {
        resolve(result.data);
        if (
          result.data.code !== HttpSuccessCode ||
          result.data.success !== true
        ) {
          console.log("xxx");
        }
      });
    });
  }
  post(url: string, config: AxiosRequestConfig<any> | undefined) {
    return new Promise((resolve, reject) => {
      axios.post(url, { ...config, baseURL: baseUrl }).then((result) => {
        resolve(result.data);
        if (
          result.data.code !== HttpSuccessCode ||
          result.data.success !== true
        ) {
          console.log("xxx");
        }
      });
    });
  }
}

export default new Http();