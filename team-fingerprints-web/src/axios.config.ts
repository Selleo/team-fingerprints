import axios from "axios";
import { isEmpty } from "lodash";

axios.defaults.baseURL = process.env.REACT_APP_API_URL;
axios.defaults.headers.common["Authorization"] =
  "Bearer safdaifEUJIFGIWYUEFCCVWBevcfvq";

const applyDefaultAPIVersioning = (url: string | undefined): string => {
  if (!url) {
    return "";
  }
  // eslint-disable-next-line @typescript-eslint/prefer-regexp-exec
  const isVersioningApplied = url.match(/\/v([0-9]+)\//);
  if (isVersioningApplied) {
    return url;
  }
  return "/v1" + url;
};

if (isEmpty((axios.interceptors.request as any).handlers)) {
  axios.interceptors.request.use(
    (config: any) => {
      const token = localStorage.getItem("token");
      config.headers.Authorization = `Bearer ${token}`;
      config.url = applyDefaultAPIVersioning(config.url);
      return config;
    },
    (error) => {
      void Promise.reject(error);
    }
  );
}
