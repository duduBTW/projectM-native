import axios, { AxiosInstance } from "axios";
import qs from "query-string";
import { storageAuthToken, storageRefreshToken } from "../auth/auth-storage";

export const baseMangadexApi = axios.create({
  baseURL: process.env.EXPO_PUBLIC_MANGADEX_API_URL,
  paramsSerializer: (params) => {
    return qs.stringify(params, {
      arrayFormat: "bracket",
      encode: false,
    });
  },
});

function withAuth(instance: AxiosInstance) {
  instance.interceptors.request.use(async (config) => {
    const token = await storageAuthToken.get();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  });

  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const config = error?.config;

      if (error?.response?.status === 401 && !config?.sent) {
        config.sent = true;

        const token = await storageRefreshToken.refresh();
        if (!token) {
          return Promise.reject(error);
        }

        config.headers.Authorization = `Bearer ${token}`;

        return baseMangadexApi(config);
      }
      return Promise.reject(error);
    }
  );

  return instance;
}

export const mangadexApi = withAuth(baseMangadexApi);
