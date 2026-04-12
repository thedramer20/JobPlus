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
  const skipLoader =
    (typeof config.headers?.get === "function" && config.headers.get("x-skip-global-loader")) ||
    (config.headers as Record<string, unknown> | undefined)?.["x-skip-global-loader"];
  if (!skipLoader) {
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
    const skipLoader =
      (typeof response.config.headers?.get === "function" && response.config.headers.get("x-skip-global-loader")) ||
      (response.config.headers as Record<string, unknown> | undefined)?.["x-skip-global-loader"];
    if (!skipLoader) {
      endGlobalLoading();
    }
    return response;
  },
  (error) => {
    const skipLoader =
      (typeof error?.config?.headers?.get === "function" && error.config.headers.get("x-skip-global-loader")) ||
      (error?.config?.headers as Record<string, unknown> | undefined)?.["x-skip-global-loader"];
    if (!skipLoader) {
      endGlobalLoading();
    }
    if (error?.response?.status === 401) {
      authStore.getState().logout();
    }
    return Promise.reject(error);
  }
);
