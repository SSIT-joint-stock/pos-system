import axios, { AxiosError } from 'axios';
import { getDefaultStore } from 'jotai';
import {
  accessTokenAtom,
  currentUserAtom,
} from './../../../../../packages/design-system/src/stores/auth';

const store = getDefaultStore();

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

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
    const isLoginRequest = originalRequest.url?.includes('/auth/login');

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (!isLoginRequest) {
        if (isRefreshing) {
          // Nếu đang refresh, đợi trong queue
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              return api(originalRequest);
            })
            .catch((err) => {
              return Promise.reject(err);
            });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          const res = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token`,
            {},
            { withCredentials: true }
          );

          const { access_token, user } = res.data.data;

          // Cập nhật token và user info
          store.set(accessTokenAtom, access_token);
          if (user) {
            store.set(currentUserAtom, user);
          }

          // Process queue với token mới
          processQueue(null, access_token);

          originalRequest.headers.Authorization = `Bearer ${access_token}`;
          return api(originalRequest);
        } catch (refreshError) {
          // Clear tokens nếu refresh thất bại
          store.set(accessTokenAtom, null);
          store.set(currentUserAtom, null);

          processQueue(refreshError, null);

          // Redirect to login hoặc handle logout
          if (typeof window !== 'undefined') {
            // window.location.href = '/login'; // Uncomment nếu cần redirect
          }

          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;
