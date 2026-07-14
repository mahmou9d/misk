"use client";

import axios from "axios";

const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL ||
  "https://misk-production.up.railway.app/api";

export const publicClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

publicClient.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const selectedLanguage =
      localStorage.getItem("lang")?.toLowerCase() || "ar";
    config.headers["Accept-Language"] = selectedLanguage;
  }
  return config;
});
