import axios from "axios";
import qs from "qs";
import { useMessage } from "naive-ui";

type DownloadOption = {
  url: string;
  query?: Record<string, any>;
  isFromServe?: boolean;
  openTab?: boolean;
};

const baseUrl = "http://172.31.227.163:4000";

class Download {
  constructor() {}
  downloadFile({
    url,
    query = {},
    isFromServe = true,
    openTab = false,
  }: DownloadOption) {
    const id = "downlod-file-iframe";
    let iframe: HTMLIFrameElement = document.getElementById(
      id
    ) as HTMLIFrameElement;
    if (!iframe) {
      iframe = document.createElement("iframe");
      iframe.id = id;
      iframe.style.display = "none";
      document.body.appendChild(iframe);
    }
    let fileUrl = "";
    const queryString = qs.stringify(query) ? `&${qs.stringify(query)}` : "";
    if (isFromServe) {
      fileUrl =
        url.indexOf("?") >= 0
          ? `${baseUrl}${url}&_t=${Date.now()}${queryString}`
          : `${baseUrl}${url}?_t=${Date.now()}${queryString}`;
    } else {
      fileUrl =
        url.indexOf("?") >= 0
          ? `${url}&_t=${Date.now()}${queryString}`
          : `${url}?_t=${Date.now()}${queryString}`;
    }
    if (openTab) {
      window.open(fileUrl, "_blank");
      return;
    }
    // 探测下载文件能否被下载
    axios
      .request({
        url: fileUrl,
        responseType: "blob",
      })
      .then((res) => {
        const { data } = res;
        if (data.type === "application/json") {
          const reader = new FileReader();
          reader.readAsText(data, "utf-8");
          reader.onload = function () {
            const result = JSON.parse(String(reader.result));
            if (result.success) {
            } else {
            }
          };
        } else {
          // iframe.src = fileUrl
          const blob = new Blob([data], {
            type: "application/vnd.ms-excel",
          });
          const resUrl = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.style.display = "none";
          link.href = resUrl;
          const contentDisposition = res.headers["content-disposition"];
          const matchName = contentDisposition.match(
            /(?<=filename=|filename\*=utf-8'')(\S*)(?=\.)(\S\w*)/gi
          );
          link.download = matchName
            ? decodeURIComponent(matchName[0])
            : "下载文件";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      })
      .catch((err) => {
        iframe ? (iframe.src = fileUrl) : null;
      });
  }
  /**
   * post方式下载文件的封装
   * @param {*} param0
   */
  downloadFileWithPost(
    exportUrl: string,
    params?: Record<string, any>,
    query?: Record<string, any>
  ) {
    axios
      .request({
        url: `${baseUrl}${exportUrl}`,
        method: "post",
        params: query,
        data: params,
        responseType: "blob",
      })
      .then((res) => {
        if (res.data.type === "application/json") {
          const reader = new FileReader();
          reader.readAsText(res.data, "utf-8");
          reader.onload = function () {
            const result = JSON.parse(String(reader.result));
            if (result.success) {
            } else {
            }
          };
        } else {
          const blob = new Blob([res.data], {
            type: "application/vnd.ms-excel",
          });
          const resUrl = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.style.display = "none";
          link.href = resUrl;
          const contentDisposition = res.headers["content-disposition"];
          const matchName = contentDisposition.match(
            /(?<=filename=|filename\*=utf-8'')(\S*)(?=\.)(\S\w*)/gi
          );
          link.download = matchName
            ? decodeURIComponent(matchName[0])
            : "证券风评列表";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      })
      .catch((err) => {});
  }
}

export default new Download();
