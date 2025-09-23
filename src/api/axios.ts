/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// src/api/axios.ts
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { authService } from "./auth";

const API_BASE = import.meta.env.VITE_APP_API_BASE || "/api";

/**
 * Primary axios instance for API calls that include access token header.
 */
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
  // Do NOT include cookies by default for most API calls. For refresh we use a separate call withCredentials: true.
  withCredentials: false,
});

/**
 * Axios instance used specifically for refresh call which must include HttpOnly refresh cookie.
 */
const axiosRefresh = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

let isRefreshing = false;
let refreshCall: Promise<string | null> | null = null;

/**
 * Perform refresh (single flight)
 */
async function performRefresh(): Promise<string | null> {
  if (isRefreshing && refreshCall) return refreshCall;
  isRefreshing = true;
  refreshCall = (async () => {
    try {
      const resp = await axiosRefresh.post("/auth/refresh");
      const accessToken = resp?.data?.data?.accessToken;
      if (accessToken) {
        authService.setAccessToken(accessToken);
        return accessToken;
      }
      // no token returned
      authService.clearAccessToken();
      return null;
    } catch (err) {
      authService.clearAccessToken();
      return null;
    } finally {
      isRefreshing = false;
      refreshCall = null;
    }
  })();
  return refreshCall;
}

/**
 * Request interceptor: attach Authorization header if we have token
 */
apiClient.interceptors.request.use((config: AxiosRequestConfig) => {
  const token = authService.getAccessToken();
  if (token && config && config.headers) {
    config.headers["Authorization"] = `Bearer ${token}`;
  } else if (config && config.headers) {
    delete config.headers["Authorization"];
  }
  return config;
});

/**
 * Response interceptor: on 401 attempt refresh once, then retry original request
 */
apiClient.interceptors.response.use(
  (resp: any) => resp,
  async (error: { config: any; response: { status: any; }; }) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };
    if (!originalRequest || originalRequest._retry) {
      return Promise.reject(error);
    }

    const status = error.response?.status;
    if (status === 401) {
      originalRequest._retry = true;
      const newToken = await performRefresh();
      if (newToken) {
        // set header and retry
        if (!originalRequest.headers) originalRequest.headers = {};
        originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
        return apiClient(originalRequest);
      }
    }
    return Promise.reject(error);
  }
);

export type ApiResponse<T = any> = AxiosResponse<T>;
export default apiClient;
