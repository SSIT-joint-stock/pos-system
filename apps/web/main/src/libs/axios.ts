/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosError } from "axios";
// import { AppStore } from "@/store";
// import { setCredentials, logout } from "@/store/features/authSlice";

// ==================
// Cách 1: Dùng Redux
// let storeRef: AppStore;
// export const setStore = (store: AppStore) => {
//   storeRef = store;
// };

// ==================
// Cách 2: Không lưu đâu cả (chỉ giữ trong biến global)
let accessToken: string | null = null;
export const setAccessToken = (token: string | null) => {
  accessToken = token;
};

// ==================
// Axios instance
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true, // gửi cookie chứa refresh_token
});

// ==================
// Request interceptor
api.interceptors.request.use(
  (config) => {
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
      const isLoginRequest =
        originalRequest.url && originalRequest.url.includes("/auth/login");

      if (!isLoginRequest) {
        originalRequest._retry = true;
        try {
          const res = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
            {},
            { withCredentials: true }
          );

          const { access_token, user } = res.data;

          // ==================
          // Không lưu Redux
          setAccessToken(access_token);

          // ==================
          // Sau này muốn lưu Redux thì bật đoạn này
          // storeRef.dispatch(setCredentials({ accessToken: access_token, user }));

          // Gắn accessToken mới vào request cũ
          originalRequest.headers.Authorization = `Bearer ${access_token}`;

          return api(originalRequest);
        } catch (refreshError) {
          // ==================
          // Sau này muốn clear Redux thì bật đoạn này
          // storeRef.dispatch(logout());

          setAccessToken(null);
          return Promise.reject(refreshError);
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;
