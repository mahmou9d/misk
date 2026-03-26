"use client";

import axios from "axios";

const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL ||
  "https://web-production-1ab2d.up.railway.app/api/";

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Request Interceptor - Attach token
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("access");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      const selectedLanguage = localStorage.getItem("lang")?.toLowerCase() || "ar";
      config.headers["Accept-Language"] = selectedLanguage;
      const isCartRequest = config.url?.startsWith("/cart");
      if (isCartRequest) {
        const deviceId = localStorage.getItem("X-Device-ID");
        if (deviceId) {
          config.headers["x-Device-ID"] = deviceId;
        }
      }
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response Interceptor - Handle token refresh on 401
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken =
        typeof window !== "undefined" ? localStorage.getItem("refresh") : null;

      if (!refreshToken) return Promise.reject(error);

      try {
        const { data } = await axios.post(`${BASE_URL}/auth/token/refresh/`, {
          refresh: refreshToken,
        });

        localStorage.setItem("access", data.access);
        if (data.refresh) localStorage.setItem("refresh", data.refresh);

        originalRequest.headers.Authorization = `Bearer ${data.access}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        // window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);
