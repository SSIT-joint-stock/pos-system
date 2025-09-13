import { accessTokenAtom } from "./../../../../../packages/design-system/src/stores/auth";
/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosError } from "axios";
import { getDefaultStore } from "jotai";

const store = getDefaultStore();

// Axios instance
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true, // gửi cookie chứa refresh_token
});

// ==================
// Request interceptor
api.interceptors.request.use(
  (config) => {
    const accessToken = store.get(accessTokenAtom);
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ==================
// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as any;

    if (error.response?.status === 401 && !originalRequest._retry) {
      const isLoginRequest = originalRequest.url && originalRequest.url.includes("/auth/login");

      if (!isLoginRequest) {
        originalRequest._retry = true;
        try {
          const res = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token`,
            {},
            { withCredentials: true }
          );

          const { access_token, user } = res.data.data;
          // console.log(access_token, user);
          // ==================
          store.set(accessTokenAtom, access_token);

          originalRequest.headers.Authorization = `Bearer ${access_token}`;

          return api(originalRequest);
        } catch (refreshError) {
          store.set(accessTokenAtom, null);
          return Promise.reject(refreshError);
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;
