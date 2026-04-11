import axios from "axios";
import { env } from "./env";
import { authStore } from "../store/auth-store";
import { beginGlobalLoading, endGlobalLoading } from "./loading-store";

export const http = axios.create({
  baseURL: env.apiBaseUrl,
  headers: {
    "Content-Type": "application/json"
  }
});

http.interceptors.request.use((config) => {
  if (!config.headers["x-skip-global-loader"]) {
    beginGlobalLoading();
  }
  const token = authStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

http.interceptors.response.use(
  (response) => {
    if (!response.config.headers["x-skip-global-loader"]) {
      endGlobalLoading();
    }
    return response;
  },
  (error) => {
    if (!error?.config?.headers?.["x-skip-global-loader"]) {
      endGlobalLoading();
    }
    if (error?.response?.status === 401) {
      authStore.getState().logout();
    }
    return Promise.reject(error);
  }
);
